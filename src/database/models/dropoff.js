'use strict';
module.exports = function(sequelize, DataTypes) {
  var Dropoff = sequelize.define('Dropoff', {
    date: DataTypes.STRING,
    groupID: DataTypes.INTEGER,
    ballotID: DataTypes.INTEGER,
    shipDate: DataTypes.STRING,
    voteDateBeg: DataTypes.STRING,
    voteDateEnd: DataTypes.STRING,
    pricePerDormPackage: DataTypes.DECIMAL,
    pricePerCookingPackage: DataTypes.DECIMAL,
    totalDormPackagesOrdered: DataTypes.INTEGER,
    totalCookingPackagesOrdered: DataTypes.INTEGER,
    totalDollarAmount: DataTypes.DECIMAL,
    pctFeePerPackage: DataTypes.DECIMAL,
    totalRevenueBeforeStripe: DataTypes.DECIMAL,
    totalRevenueAftereStripe: DataTypes.DECIMAL,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Dropoff;
};
