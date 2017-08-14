const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

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

module.exports.getBallotUserVotes = async (requestBody) => {
  const ballots = [];
  const getBallotUserVotesResult = await models.Ballot.findAll({
    where: {
      dropoffID: requestBody.dropoffID,
    },
  });

  for (let i = 0; i < getBallotUserVotesResult.length; i++) {
    const foodItem = {
      name: getBallotUserVotesResult[i].foodName,
      imageUrl: getBallotUserVotesResult[i].imageUrl,
    };
    ballots.push(foodItem);
  }

  const userID = await userUtil.findUserID(requestBody.uid);
  const userVotes = await voteUtil.findVotesByUser(userID);

  const ballotsAndVotes = await ballots.map((ballot) => {
    const ballotsVotes = {};
    ballotsVotes.name = ballot.name;
    ballotsVotes.imageUrl = ballot.imageUrl;
    ballotsVotes.isCurrent = JSON.stringify(userVotes) === JSON.stringify({}) ? false : userVotes[ballot.name];
    return ballotsVotes;
  });

  return ballotsAndVotes;
};