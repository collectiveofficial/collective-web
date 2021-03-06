const models = require('../../database/models/index');
const ballotUtil = require('./ballot');
const userUtil = require('./user');
const foodUtil = require('./food');

module.exports.saveVotes = async (requestBody, dropoffID) => {
  try {
    // iterate through the food object of the request body
    for (let foodItem in requestBody.foodObj) {
      // find food id from name in ballot table
      // find ballot id from food id in ballot table
      const findFoodInfoResult = await ballotUtil.findFoodInfo(foodItem, dropoffID);
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
        isCurrent: requestBody.foodObj[foodItem].isCurrent,
        isUserAllergic: requestBody.foodObj[foodItem].isAllergic,
      });
      // count all votes where isCurrent is true
      const findAllTrueVotes = await models.Vote.findAll({
        where: {
          isCurrent: true,
          foodID: findFoodInfoResult.dataValues.foodID,
          dropoffID: findFoodInfoResult.dataValues.dropoffID,
        },
      });
      // set ballot voteCount where foodID and dropoffID match
      await ballotUtil.changeVoteCount(findAllTrueVotes.length, findFoodInfoResult.dataValues.foodID, findFoodInfoResult.dataValues.dropoffID);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateVotes = async (requestBody) => {
  try {
    for (let foodItem in requestBody.foodObj) {
      const findFoodInfoResult = await ballotUtil.findFoodInfo(foodItem, requestBody.dropoffID);
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
      // count all votes where isCurrent is true
      const findAllTrueVotes = await models.Vote.findAll({
        where: {
          isCurrent: true,
          foodID: findFoodInfoResult.dataValues.foodID,
          dropoffID: findFoodInfoResult.dataValues.dropoffID,
        },
      });
      // set ballot voteCount where foodID and dropoffID match
      await ballotUtil.changeVoteCount(findAllTrueVotes.length, findFoodInfoResult.dataValues.foodID, findFoodInfoResult.dataValues.dropoffID);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.findVotesByUserAndDropoff = async (userID, dropoffID) => {
  try {
    const votes = {};
    const findVotesByUserAndDropoffResult = await models.Vote.findAll({
      where: {
        userID,
        dropoffID,
      },
    });
    if (findVotesByUserAndDropoffResult.length > 0) {
      for (let i = 0; i < findVotesByUserAndDropoffResult.length; i++) {
        const foodName = findVotesByUserAndDropoffResult[i].dataValues.foodName;
        const isCurrent = findVotesByUserAndDropoffResult[i].dataValues.isCurrent;
        votes[foodName] = isCurrent;
      }
    }
    return votes;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUserAllergies = async (userID, dropoffID) => {
  try {
    const allergicFoodList = [];
    const allergyVotes = await models.Vote.findAll({
      where: {
        userID,
        dropoffID,
        isUserAllergic: true,
      },
    });
    for (let i = 0; i < allergyVotes.length; i++) {
      const allergicFoodID = allergyVotes[i].dataValues.foodID;
      const allergicFoodName = await foodUtil.findFoodNameByID(allergicFoodID);
      allergicFoodList.push(allergicFoodName);
    }
    return allergicFoodList;
  } catch (err) {
    console.log(err);
  }
};
