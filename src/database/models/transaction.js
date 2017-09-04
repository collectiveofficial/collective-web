'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    userID: DataTypes.INTEGER,
    hasVoted: DataTypes.BOOLEAN,
    hasPaid: DataTypes.BOOLEAN,
    dropoffID: DataTypes.INTEGER,
    dormPackagesOrdered: DataTypes.INTEGER,
    cookingPackagesOrdered: DataTypes.INTEGER,
    totalDollarAmount: DataTypes.DECIMAL,
    revenueBeforeStripe: DataTypes.DECIMAL,
    revenueAfterStripe: DataTypes.DECIMAL,
    isDelivery: DataTypes.BOOLEAN,
    hasAllergies: DataTypes.BOOLEAN,
    hasUserPickedUp: DataTypes.BOOLEAN,
    pickupTime: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Transaction;
};
