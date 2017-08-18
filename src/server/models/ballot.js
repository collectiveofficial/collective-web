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
  console.log('-------> requestBody.dropoffID: ', requestBody.dropoffID);
  console.log('-------> typeof requestBody.dropoffID: ', typeof requestBody.dropoffID);
  try {
    getBallotUserVotesResult = await models.Ballot.findAll({
      where: {
        dropoffID: requestBody.dropoffID,
      },
    });
  } catch (err) {
    console.log(err);
  }

  console.log('--------> getBallotUserVotesResult: ', getBallotUserVotesResult);

  for (let i = 0; i < getBallotUserVotesResult.length; i++) {
    const foodItem = {
      name: getBallotUserVotesResult[i].foodName,
      imageUrl: getBallotUserVotesResult[i].imageUrl,
    };
    ballots.push(foodItem);
  }
  await console.log('--------> ballots: ', ballots);

  const userID = await userUtil.findUserID(requestBody.uid);
  await console.log('--------> userID: ', userID);
  const userVotes = await voteUtil.findVotesByUser(userID);
  await console.log('--------> userVotes: ', userVotes);
  const ballotsAndVotes = await ballots.map((ballot) => {
    const ballotsVotes = {};
    ballotsVotes.name = ballot.name;
    ballotsVotes.imageUrl = ballot.imageUrl;
    ballotsVotes.isCurrent = JSON.stringify(userVotes) === JSON.stringify({}) ? false : userVotes[ballot.name];
    return ballotsVotes;
  });
  await console.log('--------> ballotsAndVotes: ', ballotsAndVotes);

  return ballotsAndVotes;
};
