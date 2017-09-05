const models = require('../../database/models/index');
const ballotUtil = require('./ballot');

module.exports.doesFoodItemExist = (id) => {
  return models.Food.findOne({
    where: {
      id,
    }
  })
  .then((doesFoodItemExistResult) => {
    if (doesFoodItemExistResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.populateFoodItemsBallots = (foodItems, ballotID, dropoff) => {
  console.log('Food items: ', foodItems);
  foodItems.forEach(async (foodItem) => {
    try {
      const foodItemCreateResult = await models.Food.create({
        name: foodItem.name,
        imageUrl: foodItem.imageUrl,
      });
      const id = foodItemCreateResult.dataValues.id;
      const name = foodItemCreateResult.dataValues.name;
      const imageUrl = foodItemCreateResult.dataValues.imageUrl;
      const food = {
        id,
        name,
        imageUrl,
      };
      const doesBallotExist = await ballotUtil.doesBallotExist(dropoff.id);
      if (!doesBallotExist) {
        await ballotUtil.populateBallot(dropoff, food);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.doesPapayaExist = async () => {
  try {
    const doesPapayaExistResult = await models.Food.findOne({
      where: {
        name: 'Papaya',
      },
    });
    if (doesPapayaExistResult !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.findAllFirstDropFoodItems = () => {
  return models.Food.findAll()
  .then((findAllFoodItemsResult) => {
    return findAllFoodItemsResult;
  })
  .catch(err => console.log(err));
};

module.exports.findFoodNameByID = async (id) => {
  try {
    const food = await models.Food.findOne({
      where: {
        id,
      },
    });
    const foodName = food.dataValues.name;
    return foodName;
  } catch (err) {
    console.log(err);
  }
};
