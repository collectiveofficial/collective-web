const models = require('../../database/models/index');
const ballotUtil = require('./ballot');
const userUtil = require('./user');

module.exports.saveVotes = async (requestBody) => {
  // iterate through the food object of the request body
  for (let foodItem in requestBody.foodObj) {
    // find food id from name in ballot table
    // find ballot id from food id in ballot table
    const findFoodInfoResult = await ballotUtil.findFoodInfo(foodItem);
    const userID = await userUtil.findUserID(requestBody.uid);
    // TODO: save findFoodInfoResult's foodID, foodName, ballotID into Vote
    await models.Vote.create({
      firebaseUID: requestBody.uid,
      userID,
      foodID: findFoodInfoResult.dataValues.foodID,
      foodName: findFoodInfoResult.dataValues.foodName,
      dropoffID: findFoodInfoResult.dataValues.dropoffID,
      voteClass: null,
      ballotID: findFoodInfoResult.dataValues.id,
      isCurrent: requestBody.foodObj[foodItem],
    })
    .catch(err => console.log(err));

    // increment vote count in ballot
    await ballotUtil.changeVoteCount(requestBody.foodObj[foodItem], findFoodInfoResult.dataValues.foodID, findFoodInfoResult.dataValues.dropoffID);
  }
};

module.exports.updateVotes = async (requestBody) => {
  for (let foodItem in requestBody.foodObj) {
    const findFoodInfoResult = await ballotUtil.findFoodInfo(foodItem);
    await models.Vote.update({
      isCurrent: requestBody.foodObj[foodItem],
    }, {
      where: {
        firebaseUID: requestBody.uid,
        foodID: findFoodInfoResult.dataValues.foodID,
        foodName: findFoodInfoResult.dataValues.foodName,
        dropoffID: findFoodInfoResult.dataValues.dropoffID,
        ballotID: findFoodInfoResult.dataValues.id,
      },
    });
    await ballotUtil.changeVoteCount(requestBody.foodObj[foodItem], findFoodInfoResult.dataValues.foodID, findFoodInfoResult.dataValues.dropoffID);
  }
};

module.exports.findVotesByUser = async (userID) => {
  const votes = {};
  const findVotesByUserResult = await models.Vote.findAll({
    where: {
      userID,
    },
  });
  if (findVotesByUserResult.length > 0) {
    for (let i = 0; i < findVotesByUserResult.length; i++) {
      const foodName = findVotesByUserResult[i].dataValues.foodName;
      const isCurrent = findVotesByUserResult[i].dataValues.isCurrent
      votes[foodName] = isCurrent;
    }
  }
  return votes;
};