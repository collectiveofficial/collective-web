const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

module.exports.savePaymentInfo = async (requestBody, dropoffID) => {
  const userID = await models.userUtil.findUserID(requestBody.uid);
  await models.Payment.create({
    userID,
    hasVoted: true,
    hasPaid: true,
    dropoffID,
    dormPackagesOrdered: requestBody.dormPackagesOrdered,
    cookingPackagesOrdered: requestBody.cookingPackagesOrdered,
    totalDollarAmount: requestBody.totalDollarAmount,
    revenueBeforeStripe: requestBody.totalDollarAmount - requestBody.price,
    revenueAfterStripe: requestBody.totalDollarAmount - ((requestBody.totalDollarAmount * 0.029) + 0.3),
  });
};
