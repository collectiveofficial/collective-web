const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

module.exports.savePaymentInfo = async (requestBody, dropoffID) => {
  const stripeFees = (requestBody.totalDollarAmount * 0.029) + 0.3;
  const revenueBeforeStripe = Number((requestBody.cookingPackageFees + requestBody.transactionFee).toFixed(2));
  const revenueAfterStripe = Number((revenueBeforeStripe - stripeFees).toFixed(2));
  // 0.38 = 1 - 0.68
  // revenueAfterStripe = revenueBeforeStripe - stripeFees
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
