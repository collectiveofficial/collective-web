const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');
const dropoffUtil = require('./dropoff');

module.exports.savePaymentInfo = async (requestBody, dropoffID) => {
  try {
    const stripeFees = Number(((requestBody.totalDollarAmount * 0.029) + 0.3).toFixed(2));
    const feeChargedToBFF = requestBody.dormPackagesOrdered * 0.5;
    const deliveryFeeAttributedToCollective = requestBody.deliveryFee / 3;
    // const revenueBeforeStripe = Number((requestBody.cookingPackageFees + requestBody.transactionFee + feeChargedToBFF + deliveryFeeAttributedToCollective).toFixed(2));
    const earningsOnCookingPackages = Number(requestBody.cookingPackagesTotalDollarAmount - (10 * requestBody.cookingPackagesOrdered))
    const revenueBeforeStripe = Number((earningsOnCookingPackages + feeChargedToBFF + deliveryFeeAttributedToCollective).toFixed(2));
    const revenueAfterStripe = Number((revenueBeforeStripe - stripeFees).toFixed(2));
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
      isDelivery: requestBody.userWantsDelivery,
    });
    const transactions = await models.Transaction.findAll({
      where: {
        isDelivery: true,
      },
    });
    const deliveriesOrderedCount = transactions.length;
    // increment the deliveriesOrderedCount on the appropriate dropoffID by 1
    await dropoffUtil.changeDeliveriesOrderedCount(dropoffID, deliveriesOrderedCount);
  } catch(err) {
    console.log(err);
  }
};

module.exports.checkTransaction = async (requestBody) => {
  try {
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
  } catch(err) {
    console.log(err);
  }
};

module.exports.getUserInfoAndPackagesOrdered = async (dropoffID) => {
  try {
    let userNamesAndPackagesOrdered = [];
    const transactions = await models.Transaction.findAll({
      where: {
        dropoffID,
      },
    });
    for (let i = 0; i < transactions.length; i++) {
      const userObj = await userUtil.findUserInfoByID(transactions[i].dataValues.userID);
      const dataObj = {
        'Last Name': userObj.lastName,
        'First Name': userObj.firstName,
        Email: userObj.email,
        'Phone Number': userObj.phoneNumber,
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
  } catch(err) {
    console.log(err);
  }
};

module.exports.getUserTransactionHistory = async (uid) => {
  try {
    const transactions = [];
    let dataObj;
    const userID = await userUtil.findUserID(uid);
    const getUserTransactionHistoryResults = await models.Transaction.findAll({
      where: {
        userID,
      },
    });
    for (let i = 0; i < getUserTransactionHistoryResults.length; i++) {
      const dropoffDate = await dropoffUtil.findDropoffDateByID(getUserTransactionHistoryResults[i].dataValues.dropoffID);
      let deliveryAddress = '';
      if (getUserTransactionHistoryResults[i].dataValues.isDelivery) {
        deliveryAddress = await userUtil.findFormattedAddress(uid);
      }
      dataObj = {
        dropoffDate,
        date: getUserTransactionHistoryResults[i].dataValues.createdAt,
        dormPackagesOrdered: getUserTransactionHistoryResults[i].dataValues.dormPackagesOrdered,
        cookingPackagesOrdered: getUserTransactionHistoryResults[i].dataValues.cookingPackagesOrdered,
        isDelivery: getUserTransactionHistoryResults[i].dataValues.isDelivery,
        deliveryAddress,
        totalDollarAmount: getUserTransactionHistoryResults[i].dataValues.totalDollarAmount,
      }
      transactions.push(dataObj);
    }
    return transactions;
  } catch(err) {
    console.log(err);
  }
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
