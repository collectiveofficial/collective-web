const models = require('../../database/models/index');
const foodUtil = require('./food');

module.exports.doesBallotExist = () => {
  return models.Ballot.findOne({
    where: {
      id: 1,
    }
  })
  .then((doesBallotExistResult) => {
    if (doesBallotExistResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.populateBallots = async (dropoffID, voteDateTimeBeg, voteDateTimeEnd) => {
  const findAllFirstDropFoodItems = await foodUtil.findAllFirstDropFoodItems();
  await findAllFirstDropFoodItems.forEach((foodItem) => {
    models.Ballot.create({
      dropoffID,
      foodID: foodItem.dataValues.id,
      foodName: foodItem.dataValues.name,
      imageUrl: foodItem.dataValues.imageUrl,
      voteCount: 0,
      wasShipped: false,
      elected: false,
      notShippedDesc: null,
      notShippedClass: null,
      shipDate: null,
      voteDateTimeBeg,
      voteDateTimeEnd,
    });
  });
};

module.exports.findFoodInfo = async (foodName) => {
  return models.Ballot.findOne({
    where: {
      foodName,
    },
  })
  .then((findFoodInfoResult) => {
    // console.log(findFoodInfoResult);
    return findFoodInfoResult;
  })
  .catch(err => console.log(err));
};

module.exports.changeVoteCount = async (isChosen, foodID, dropoffID) => {
  let changeCount;
  // if vote is true
    // change vote
  if (isChosen) {
    changeCount = 1;
  } else {
    changeCount = -1;
  }

  const findBallotRowResult = await models.Ballot.findOne({
    where: {
      foodID,
      dropoffID,
    },
  });

  await findBallotRowResult.increment('voteCount', {
    by: changeCount,
  });
};

module.exports.getDefaultBallots = async (dropoffID) => {
  const getDefaultBallotsResult = await models.Ballot.findAll({
    where: {
      dropoffID,
    },
  });
  console.log('------------> getDefaultBallotsResult: ', getDefaultBallotsResult);
  return getDefaultBallotsResult;
};
