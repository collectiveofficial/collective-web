const moment = require('moment-timezone');
const momentOriginal = require('moment');
const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');
const ballotUtil = require('./ballot');
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
      hasAllergies: requestBody.hasAllergies,
    });
    const deliveryTransactions = await models.Transaction.findAll({
      where: {
        isDelivery: true,
      },
    });
    const allergiesTransactions = await models.Transaction.findAll({
      where: {
        hasAllergies: true,
      },
    });
    const deliveriesOrderedCount = deliveryTransactions.length;
    const allergiesCount = allergiesTransactions.length;
    // increment the deliveriesOrderedCount on the appropriate dropoffID by 1
    await dropoffUtil.changeDeliveriesOrderedCount(dropoffID, deliveriesOrderedCount);
    await dropoffUtil.changeAllergiesCount(dropoffID, allergiesCount);
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
      const userID = transactions[i].dataValues.userID;
      const userObj = await userUtil.findUserInfoByID(userID);
      const allergies = await voteUtil.getUserAllergies(userID, dropoffID);
      // const birthday = await userObj.birthday.toDateString();
      const birthday = await momentOriginal(userObj.birthday, 'YYYY-MM-DD').format('MM-DD-YYYY');
      const dataObj = {
        'Last Name': userObj.lastName,
        'First Name': userObj.firstName,
        'Date of Birth': birthday,
        Email: userObj.email,
        'Phone Number': userObj.phoneNumber,
        'Dorm Packages Ordered': transactions[i].dataValues.dormPackagesOrdered,
        'Cooking Packages Ordered': transactions[i].dataValues.cookingPackagesOrdered,
        Allergies: allergies,
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
      let dropoffDate = await dropoffUtil.findDropoffDateByID(getUserTransactionHistoryResults[i].dataValues.dropoffID);
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

module.exports.getUserInfoForPickup = async (dropoffID, firebaseUID) => {
  try {
    const userID = await userUtil.findUserID(firebaseUID);
    const transaction = await models.Transaction.findOne({
      where: {
        dropoffID,
        userID,
      },
    });
    const userObj = await userUtil.findUserInfoByID(userID);
    const birthday = await momentOriginal(userObj.birthday, 'YYYY-MM-DD').format('MM-DD-YYYY');
    const allergies = await voteUtil.getUserAllergies(userID, dropoffID);
    const userNameAndPackagesOrdered = {
      'Order ID': transaction.id,
      'Last Name': userObj.lastName,
      'First Name': userObj.firstName,
      'Dorm Packages Ordered': transaction.dormPackagesOrdered,
      'Cooking Packages Ordered': transaction.cookingPackagesOrdered,
      'Date of Birth': birthday,
      Allergies: allergies,
    };
    return userNameAndPackagesOrdered;
  } catch(err) {
    console.log(err);
  }
};

module.exports.recordUserPickup = async (id) => {
  try {
    await models.Transaction.update({
      hasUserPickedUp: true,
      pickupTime: moment.tz(new Date(), 'America/New_York').format(),
    }, {
      where: {
        id,
      },
    });
  } catch(err) {
    console.log(err);
  }
};

module.exports.findEmailReceiptInfo = async (dropoffID, firebaseUID) => {
  try {
    const userID = await userUtil.findUserID(firebaseUID);
    const userObj = await userUtil.findUserInfoByID(userID);
    const dropoffObj = await dropoffUtil.findDateTimesByID(dropoffID);
    const intendedShipDate = moment.tz(dropoffObj.intendedShipDate, 'America/New_York').format('MM-DD-YYYY');
    const intendedPickupTimeStart = moment.tz(dropoffObj.intendedPickupTimeStart, 'America/New_York').format('HH:MM A');
    const intendedPickupTimeEnd = moment.tz(dropoffObj.intendedShipDate, 'America/New_York').format('HH:MM A');
    const emailReceiptInfo = {
      firstName: userObj.firstName,
      intendedShipDate,
      intendedPickupTimeStart,
      intendedPickupTimeEnd,
    };
    return emailReceiptInfo;
  } catch(err) {
    console.log(err);
  }
};
