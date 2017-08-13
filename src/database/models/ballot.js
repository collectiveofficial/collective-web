'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ballot = sequelize.define('Ballot', {
    dropoffID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    foodName: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    voteCount: DataTypes.INTEGER,
    wasShipped: DataTypes.BOOLEAN,
    elected: DataTypes.BOOLEAN,
    notShippedDesc: DataTypes.STRING,
    notShippedClass: DataTypes.STRING,
    shipDate: DataTypes.DATEONLY,
    voteDateTimeBeg: DataTypes.DATE,
    voteDateTimeEnd: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Ballot;
};
