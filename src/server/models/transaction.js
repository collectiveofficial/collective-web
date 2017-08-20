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

module.exports.getUserNamesAndPackagesOrdered = async (dropoffID) => {
  let userNamesAndPackagesOrdered = [];
  const transactions = await models.Transaction.findAll({
    where: {
      dropoffID,
    },
  });
  for (let i = 0; i < transactions.length; i++) {
    const nameObj = await userUtil.findUserNameByID(transactions[i].dataValues.userID);
    const dataObj = {
      'Last Name': nameObj.lastName,
      'First Name': nameObj.firstName,
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
}
