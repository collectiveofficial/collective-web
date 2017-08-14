const models = require('../../database/models/index');

module.exports.doesFoodItemExist = () => {
  return models.Food.findOne({
    where: {
      id: 1,
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

module.exports.populateFoodItems = (foodItems) => {
  foodItems.forEach((foodItem) => {
    models.Food.create({
      name: foodItem.name,
      imageUrl: foodItem.imageUrl,
    })
    .catch(err => console.log(err));
  });
};

module.exports.findAllFirstDropFoodItems = () => {
  return models.Food.findAll()
  .then((findAllFoodItemsResult) => {
    return findAllFoodItemsResult;
  })
  .catch(err => console.log(err));
};
