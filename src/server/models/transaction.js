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
