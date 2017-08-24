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
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Group;
};
