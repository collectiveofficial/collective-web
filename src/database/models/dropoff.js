'use strict';
module.exports = function(sequelize, DataTypes) {
  var Dropoff = sequelize.define('Dropoff', {
    intendedShipDate: DataTypes.DATEONLY,
    intendedPickupTimeStart: DataTypes.DATE,
    intendedPickupTimeEnd: DataTypes.DATE,
    groupID: DataTypes.INTEGER,
    shipDate: DataTypes.DATEONLY,
    voteDateTimeBeg: DataTypes.DATE,
    voteDateTimeEnd: DataTypes.DATE,
    pricePerDormPackage: DataTypes.DECIMAL,
    pricePerCookingPackage: DataTypes.DECIMAL,
    totalDormPackagesOrdered: DataTypes.INTEGER,
    totalCookingPackagesOrdered: DataTypes.INTEGER,
    totalDollarAmount: DataTypes.DECIMAL,
    pctFeePerPackage: DataTypes.DECIMAL,
    totalRevenueBeforeStripe: DataTypes.DECIMAL,
    totalRevenueAftereStripe: DataTypes.DECIMAL,
    deliveriesOrderedCount: DataTypes.INTEGER,
    allergiesCount: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Dropoff;
};
