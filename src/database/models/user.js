'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    streetAddress: DataTypes.STRING,
    aptSuite: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    fullAddress: DataTypes.STRING,
    subscribed: DataTypes.BOOLEAN,
    userGroupId: DataTypes.INTEGER,
    firebaseUID: DataTypes.STRING,
    hasUserFinishedSignUp: DataTypes.BOOLEAN,
    pictureUrl: DataTypes.STRING,
    isFacebookAuth: DataTypes.BOOLEAN,
    cadenceFreq: DataTypes.STRING,
    isQualifiedForDelivery: DataTypes.BOOLEAN,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
