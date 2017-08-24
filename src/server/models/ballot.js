const models = require('../../database/models/index');
const userUtil = require('./user');
const foodUtil = require('./food');
const voteUtil = require('./vote');

module.exports.doesBallotExist = (dropoffID) => {
  return models.Ballot.findOne({
    where: {
      dropoffID,
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

module.exports.populateBallot = async (dropoff, food) => {
  await models.Ballot.create({
    dropoffID: dropoff.id,
    foodID: food.id,
    foodName: food.name,
    imageUrl: food.imageUrl,
    voteCount: 0,
    wasShipped: false,
    elected: false,
    notShippedDesc: null,
    notShippedClass: null,
    shipDate: null,
    voteDateTimeBeg: dropoff.voteDateTimeBeg,
    voteDateTimeEnd: dropoff.voteDateTimeEnd,
  });
};

module.exports.findFoodInfo = async (foodName, dropoffID) => {
  return models.Ballot.findOne({
    where: {
      foodName,
      dropoffID,
    },
  })
  .then((findFoodInfoResult) => {
    // console.log(findFoodInfoResult);
    return findFoodInfoResult;
  })
  .catch(err => console.log(err));
};

module.exports.changeVoteCount = async (voteCount, foodID, dropoffID) => {
  await models.Ballot.update({
    voteCount,
  }, {
    where: {
      foodID,
      dropoffID,
    },
  });
};

module.exports.getBallotUserVotes = async (requestBody) => {
  const ballots = [];
  let getBallotUserVotesResult;
  try {
    getBallotUserVotesResult = await models.Ballot.findAll({
      where: {
        dropoffID: requestBody.dropoffID,
      },
    });
  } catch (err) {
    console.log(err);
  }
  for (let i = 0; i < getBallotUserVotesResult.length; i++) {
    const foodItem = {
      name: getBallotUserVotesResult[i].foodName,
      imageUrl: getBallotUserVotesResult[i].imageUrl,
    };
    ballots.push(foodItem);
  }
  const userID = await userUtil.findUserID(requestBody.uid);
  const userVotes = await voteUtil.findVotesByUserAndDropoff(userID, requestBody.dropoffID);
  const ballotsAndVotes = await ballots.map((ballot) => {
    const ballotsVotes = {};
    ballotsVotes.name = ballot.name;
    ballotsVotes.imageUrl = ballot.imageUrl;
    ballotsVotes.isCurrent = JSON.stringify(userVotes) === JSON.stringify({}) ? false : userVotes[ballot.name];
    return ballotsVotes;
  });
  return ballotsAndVotes;
};

module.exports.getFoodNamesAndVoteCounts = async (dropoffID) => {
  let foodNamesAndVoteCounts = [];
  let foodName;
  let voteCount;
  let dataObj;
  const ballots = await models.Ballot.findAll({
    where: {
      dropoffID,
    },
  });
  ballots.forEach((ballot) => {
    foodName = ballot.dataValues.foodName;
    voteCount = ballot.dataValues.voteCount;
    dataObj = {
      'Food Name': foodName,
      'Vote Count': voteCount,
    };
    foodNamesAndVoteCounts.push(dataObj);
  });
  foodNamesAndVoteCounts = foodNamesAndVoteCounts.sort((a, b) => b['Vote Count'] - a['Vote Count']);
  return foodNamesAndVoteCounts;
};
