const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

module.exports.savePaymentInfo = async (requestBody, dropoffID) => {
  const userID = await userUtil.findUserID(requestBody.uid);
  await models.Transaction.create({
    userID,
    hasVoted: true,
    hasPaid: true,
    dropoffID,
    dormPackagesOrdered: requestBody.dormPackagesOrdered,
    cookingPackagesOrdered: requestBody.cookingPackagesOrdered,
    totalDollarAmount: requestBody.totalDollarAmount,
    revenueBeforeStripe: requestBody.totalDollarAmount - requestBody.price,
    revenueAfterStripe: requestBody.totalDollarAmount - (requestBody.totalDollarAmount - ((requestBody.totalDollarAmount * 0.029) + 0.3)),
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
