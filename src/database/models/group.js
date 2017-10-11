'use strict';
module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    aptSuite: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    fullAddress: DataTypes.STRING,
    descriptor: DataTypes.STRING,
    currentDropoffID: DataTypes.INTEGER,
    currentVotingDropoffID: DataTypes.INTEGER,
    deliveryStreetAddress: DataTypes.STRING,
    deliveryAptSuite: DataTypes.STRING,
    deliveryCity: DataTypes.STRING,
    deliveryState: DataTypes.STRING,
    deliveryZipCode: DataTypes.STRING,
    deliveryFullAddress: DataTypes.STRING,
    locationID: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Group;
};
