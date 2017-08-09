'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
    userID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    dropoffID: DataTypes.INTEGER,
    voteClass: DataTypes.STRING,
    ballotID: DataTypes.INTEGER,
    isCurrent: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Vote;
};
