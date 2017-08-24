const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

module.exports.savePaymentInfo = async (requestBody, dropoffID) => {
  const stripeFees = Number(((requestBody.totalDollarAmount * 0.029) + 0.3).toFixed(2));
  const feeChargedToBFF = requestBody.dormPackagesOrdered * 0.5;
  const revenueBeforeStripe = Number((requestBody.cookingPackageFees + requestBody.transactionFee + feeChargedToBFF).toFixed(2));
  const revenueAfterStripe = Number((revenueBeforeStripe - stripeFees).toFixed(2)); // 1.31
  const userID = await userUtil.findUserID(requestBody.uid);
  await models.Transaction.create({
    userID,
    hasVoted: true,
    hasPaid: true,
    dropoffID,
    dormPackagesOrdered: requestBody.dormPackagesOrdered,
    cookingPackagesOrdered: requestBody.cookingPackagesOrdered,
    totalDollarAmount: Number((requestBody.totalDollarAmount).toFixed(2)),
    revenueBeforeStripe,
    revenueAfterStripe,
  });
};

module.exports.checkTransaction = async (requestBody) => {
  const userID = await userUtil.findUserID(requestBody.uid);
  const checkTransactionResult = await models.Transaction.findOne({
    where: {
      userID,
      dropoffID: requestBody.dropoffID,
      hasPaid: true,
    },
  });
  if (checkTransactionResult !== null) {
    return { hasUserPaid: true };
  } else {
    return { hasUserPaid: false };
  }
};

module.exports.getUserNamesEmailsAndPackagesOrdered = async (dropoffID) => {
  let userNamesAndPackagesOrdered = [];
  const transactions = await models.Transaction.findAll({
    where: {
      dropoffID,
    },
  });
  for (let i = 0; i < transactions.length; i++) {
    const nameObj = await userUtil.findUserNameAndEmailByID(transactions[i].dataValues.userID);
    const dataObj = {
      'Last Name': nameObj.lastName,
      'First Name': nameObj.firstName,
      Email: nameObj.email,
      'Dorm Packages Ordered': transactions[i].dataValues.dormPackagesOrdered,
      'Cooking Packages Ordered': transactions[i].dataValues.cookingPackagesOrdered,
    };
    userNamesAndPackagesOrdered.push(dataObj);
  }
  userNamesAndPackagesOrdered = userNamesAndPackagesOrdered.sort((a, b) => {
    const lastNameA = a['Last Name'].toUpperCase();
    const lastNameB = b['Last Name'].toUpperCase();
    return (lastNameA < lastNameB) ? -1 : (lastNameA > lastNameB) ? 1 : 0;
  });
  return userNamesAndPackagesOrdered;
};

module.exports.getUserTransactionHistory = async (uid) => {
  const transactions = [];
  let dataObj;
  const userID = await userUtil.findUserID(uid);
  const getUserTransactionHistoryResults = await models.Transaction.findAll({
    where: {
      userID,
    },
  });
  for (let i = 0; i < getUserTransactionHistoryResults.length; i++) {
    dataObj = {
      date: getUserTransactionHistoryResults[i].dataValues.createdAt,
      dormPackagesOrdered: getUserTransactionHistoryResults[i].dataValues.dormPackagesOrdered,
      cookingPackagesOrdered: getUserTransactionHistoryResults[i].dataValues.cookingPackagesOrdered,
      totalDollarAmount: getUserTransactionHistoryResults[i].dataValues.totalDollarAmount,
    }
    transactions.push(dataObj);
  }
  return transactions;
};

module.exports.getUsersWhoHaveNotPaid = async (dropoffID, groupID) => {
  let transactionsByDropoffIDresult;
  let userID;
  let user;
  let dataObj;
  try {
    transactionsByDropoffIDresult = await models.Transaction.findAll({
      where: {
        dropoffID,
      },
    });
  } catch (err) {
    console.log(err);
  }
  const usersThatHavePaidIds = new Set(transactionsByDropoffIDresult.map(x => x.dataValues.userID));
  const usersObjByIds = await userUtil.getUniqueUsersByGroupID(groupID);
  const userIds = new Set(Object.keys(usersObjByIds));
  let usersWhoHaveNotPaid = [];
  const usersWhoHaveNotPaidIds = [...userIds].filter(x => !usersThatHavePaidIds.has(Number(x)));
  for (let i = 0; i < usersWhoHaveNotPaidIds.length; i++) {
    // if (userID !== uniqueUsersObj[userID]) {
    dataObj = {
      'Last Name': usersObjByIds[usersWhoHaveNotPaidIds[i]].lastName,
      'First Name': usersObjByIds[usersWhoHaveNotPaidIds[i]].firstName,
      Email: usersObjByIds[usersWhoHaveNotPaidIds[i]].email,
    };
    usersWhoHaveNotPaid.push(dataObj);
    usersWhoHaveNotPaid.push(Object.assign({}, dataObj));
    // }
  }
  usersWhoHaveNotPaid = usersWhoHaveNotPaid.filter((x, index, self) => self.findIndex(t => t.Email === x.Email) === index)
  return usersWhoHaveNotPaid;
};
