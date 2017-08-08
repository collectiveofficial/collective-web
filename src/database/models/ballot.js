'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ballot = sequelize.define('Ballot', {
    dropoffID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    voteCount: DataTypes.INTEGER,
    wasShipped: DataTypes.BOOLEAN,
    elected: DataTypes.BOOLEAN,
    notShippedDesc: DataTypes.STRING,
    notShippedClass: DataTypes.STRING,
    shipDate: DataTypes.DATE,
    voteDateBeg: DataTypes.DATE,
    voteDateEnd: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Ballot;
};