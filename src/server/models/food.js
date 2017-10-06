const models = require('../../database/models/index');
const ballotUtil = require('./ballot');
const _ = require('lodash');

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

module.exports.doesLimesExist = async () => {
  try {
    const doesLimesExistResult = await models.Food.findOne({
      where: {
        name: 'Limes',
      },
    });
    if (doesLimesExistResult !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.doesLemonsExist = async () => {
  try {
    const doesLemonsExistResult = await models.Food.findOne({
      where: {
        name: 'Lemons',
      },
    });
    if (doesLemonsExistResult !== null) {
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

module.exports.getAllFoodItems = async () => {
  let foodItems = [];
  try {
    const food = await models.Food.findAll({
      where: {},
    });
    for (let i = 0; i < food.length; i++) {
      const foodItemInfo = {};
      foodItemInfo.name = food[i].dataValues.name;
      foodItemInfo.imageUrl = food[i].dataValues.imageUrl;
      foodItems.push(foodItemInfo);
    }
  } catch (err) {
    console.log(err);
  }
  foodItems = _.uniqBy(foodItems, 'name');
  return foodItems;
};
