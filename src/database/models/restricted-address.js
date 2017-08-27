'use strict';
module.exports = function(sequelize, DataTypes) {
  var RestrictedAddress = sequelize.define('RestrictedAddress', {
    name: DataTypes.STRING,
    restrictionType: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    aptSuite: DataTypes.STRING,
    city: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    fullAddress: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    dropoffID: DataTypes.INTEGER,
    groupID: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return RestrictedAddress;
};
