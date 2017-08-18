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
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Transaction;
};
