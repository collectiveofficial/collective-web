const dotenv = require('dotenv').config();
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise, // 'Promise' is the native constructor.
});
const models = require('../../database/models/index');
const groupUtil = require('./group');
const dropoffUtil = require('./dropoff');

module.exports.checkIfUserIsFacebookAuth = function (email) {
  return models.User.findOne({
    where: {
      email,
      isFacebookAuth: true,
    }
  })
  .then((checkIfUserIsFacebookAuthResult) => {
    if (checkIfUserIsFacebookAuthResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.checkIfUserEmailExists = function (email) {
  return models.User.findOne({
    where: {
      email,
    }
  })
  .then((checkUserEmailResult) => {
    console.log('checkUserEmailResult: ', checkUserEmailResult);
    if (checkUserEmailResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.addUserFromFacebookSignUp = function (user) {
  models.User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    pictureUrl: user.pictureUrl,
    firebaseUID: user.uid,
    isFacebookAuth: true,
  })
  .catch(err => console.log(err));
};

module.exports.addUserFromEmailSignUp = function (user) {
  models.User.create({
    email: user.email,
    firebaseUID: user.uid,
  })
  .catch(err => console.log(err));
};

module.exports.checkIfUserExists = function (uid) {
  return models.User.findOne({
    where: {
      firebaseUID: uid,
    }
  })
  .then((checkUserResult) => {
    console.log('checkUserResult: ', checkUserResult);
    if (checkUserResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.checkIfUserAuthorized = function (uid) {
  return models.User.findOne({
    where: {
      firebaseUID: uid,
      hasUserFinishedSignUp: true,
    }
  })
  .then((checkIfUserFinishedSignUpResult) => {
    console.log('checkUserResult: ', checkIfUserFinishedSignUpResult);
    if (checkIfUserFinishedSignUpResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.checkIfUserFinishedSignUp = function (uid) {
  return models.User.findOne({
    where: {
      firebaseUID: uid,
      hasUserFinishedSignUp: true,
    }
  })
  .then((checkIfUserFinishedSignUpResult) => {
    console.log('checkUserResult: ', checkIfUserFinishedSignUpResult);
    if (checkIfUserFinishedSignUpResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.checkIfEmailUserFinishedSignUp = function (email) {
  return models.User.findOne({
    where: {
      email,
      hasUserFinishedSignUp: true,
    }
  })
  .then((checkIfEmailUserFinishedSignUpResult) => {
    console.log('checkUserResult: ', checkIfEmailUserFinishedSignUpResult);
    if (checkIfEmailUserFinishedSignUpResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.checkIfFacebookUserFinishedSignUp = function (uid) {
  return models.User.findOne({
    where: {
      firebaseUID: uid,
      hasUserFinishedSignUp: true,
    }
  })
  .then((checkIfFacebookUserFinishedSignUpResult) => {
    if (checkIfFacebookUserFinishedSignUpResult !== null) {
      return true;
    } else {
      return false;
    }
  })
  .catch(err => console.log(err));
};

module.exports.saveSubmittedUserInfo = async (user) => {
  const userGroupId = await groupUtil.findGroupIDbyName(user.school);
  let isQualifiedForDelivery;
  const userFullAddress = user.aptSuite.length > 0 ? `${user.streetAddress}, ${user.aptSuite}, ${user.city}, ${user.state} ${user.zipCode}` : `${user.streetAddress}, ${user.city}, ${user.state} ${user.zipCode}`;
  const deliveryOrigin = await groupUtil.findDeliveryAddressFromGroupID(userGroupId);
  const units = 'imperial';
  const distanceLimit = 5;
  const googleMapsDistanceMatrix = await googleMapsClient.distanceMatrix({
    origins: [deliveryOrigin],
    destinations: [userFullAddress],
    units,
  })
  .asPromise();
  const googleMapsDistanceMatrixResult = googleMapsDistanceMatrix.json;
  const regex = /(?:^|\s)(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?!\S)/;
  const distanceFromUserAddressText = googleMapsDistanceMatrixResult.rows[0].elements[0].distance.text;
  let distanceFromUserAddressInMiles = regex.exec(distanceFromUserAddressText)[1];
  distanceFromUserAddressInMiles = distanceFromUserAddressInMiles.replace(',', '');
  if (distanceFromUserAddressInMiles <= distanceLimit) {
    isQualifiedForDelivery = true;
  } else {
    isQualifiedForDelivery = false;
  }
  await models.User.update({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    streetAddress: user.streetAddress,
    aptSuite: user.aptSuite,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    fullAddress: userFullAddress,
    hasUserFinishedSignUp: true,
    userGroupId,
    isQualifiedForDelivery,
  }, {
    where: {
      firebaseUID: user.uid,
    },
  });
};

module.exports.findUserID = async (firebaseUID) => {
  const findUserIDResult = await models.User.findOne({
    where: {
      firebaseUID,
    },
  });
  return findUserIDResult.dataValues.id;
};

module.exports.findUserInfoByID = async (id) => {
  const user = await models.User.findOne({
    where: {
      id,
    },
  });
  return {
    firstName: user.dataValues.firstName,
    lastName: user.dataValues.lastName,
    email: user.dataValues.email,
    phoneNumber: user.dataValues.phoneNumber,
  };
};

module.exports.getUniqueUsersByGroupID = async (userGroupId) => {
  let usersObjByIds = {};
  const usersByGroupID = await models.User.findAll({
    where: {
      userGroupId,
    },
  });
  for (let i = 0; i < usersByGroupID.length; i++) {
    usersObjByIds[usersByGroupID[i].dataValues.id] = {
      lastName: usersByGroupID[i].dataValues.lastName,
      firstName: usersByGroupID[i].dataValues.firstName,
      email: usersByGroupID[i].dataValues.email,
    };
  }
  return usersObjByIds;
};

module.exports.updateIsQualifiedForDelivery = async (groupID) => {
  try {
    const findUsersResult = await models.User.findAll({
      where: {
        userGroupId: groupID,
      },
    });
    let isQualifiedForDelivery;
    for (let i = 0; i < findUsersResult.length; i++) {
      if (findUsersResult[i].dataValues.fullAddress !== null) {
        const userAddress = findUsersResult[i].dataValues.fullAddress;
        const deliveryOrigin = await groupUtil.findDeliveryAddressFromGroupID(groupID);
        const units = 'imperial';
        const distanceLimit = 5;
        const googleMapsDistanceMatrix = await googleMapsClient.distanceMatrix({
          origins: [deliveryOrigin],
          destinations: [userAddress],
          units,
        })
        .asPromise();
        const googleMapsDistanceMatrixResult = googleMapsDistanceMatrix.json;
        const regex = /(?:^|\s)(\d*\.?\d+|\d{1,3}(?:,\d{3})*(?:\.\d+)?)(?!\S)/;
        const distanceFromUserAddressText = googleMapsDistanceMatrixResult.rows[0].elements[0].distance.text;
        let distanceFromUserAddressInMiles = regex.exec(distanceFromUserAddressText)[1];
        distanceFromUserAddressInMiles = distanceFromUserAddressInMiles.replace(',', '');
        if (distanceFromUserAddressInMiles <= distanceLimit) {
          isQualifiedForDelivery = true;
        } else {
          isQualifiedForDelivery = false;
        }
        await models.User.update({
          isQualifiedForDelivery,
        }, {
          where: {
            id: findUsersResult[i].dataValues.id,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
