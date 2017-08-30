'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
    firebaseUID: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    foodName: DataTypes.STRING,
    dropoffID: DataTypes.INTEGER,
    voteClass: DataTypes.STRING,
    ballotID: DataTypes.INTEGER,
    isCurrent: DataTypes.BOOLEAN,
    isUserAllergic: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Vote;
};
