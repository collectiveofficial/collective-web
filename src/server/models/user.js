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
  try {
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
    if (googleMapsDistanceMatrixResult.destination_addresses[0] !== '') {
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
      return true;
    } else {
      return false;
    }
  } catch(err) {
    console.log(err);
  }
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

        // const dorms = [['Archer House', '2130 Neil Avenue, Columbus, OH 43210'],
        // ['Baker Hall East',	'93 West 12th Avenue, Columbus, OH 43210']
        // ['Baker Hall West',	'129 West 12th Avenue, Columbus, OH 43210']
        // ['Barrett House',	'88 W. Woodruff Ave, Columbus, OH 43210'],
        // ['Blackburn House', '136 W. Woodruff Avenue, Columbus, OH 43210'],
        // ['Bowen House', '2125 N. High Street, Columbus, OH 43210'],
        // ['Bradley Hall', '221 West 12th Avenue, Columbus, OH 43210'],
        // ['Busch House', '2115 N. High Street, Columbus, OH 43210'],
        // ['Canfield Hall', '236 West 11th Avenue, Columbus, OH 43210'],
        // ['Drackett Tower', '191 W. Lane Avenue, Columbus, OH 43210']
        // ['Fechko House', '220 West 11th Avenue, Columbus, OH 43210'],
        // ['German House', '141 West 11th Avenue, Columbus, OH 43201'],
        // ['Hanley House', '225 West 10th Avenue, Columbus, OH 43201'],
        // ['Haverfield House', '112 West Woodruff Avenue, Columbus, OH 43210'],
        // ['Houck House', '61 West Lane Avenue, Columbus, OH 43210'],
        // ['Houston House', '97 W. Lane Avenue, Columbus, OH 43210'],
        // ['Jones Tower', '123 W. Lane Ave, Columbus, OH 43210']
        // ['Lawrence Tower', '328 West Lane Avenue, Columbus, OH 43210']
        // ['Lincoln House', '1810 Cannon Drive West, Columbus, OH 43210'],
        // ['Mack Hall', '1698 Neil Avenue, Columbus, OH 43210'],
        // ['Mendoza House', '194 West Woodruff Ave., Columbus, OH 43210'],
        // ['Morrill Tower', '1900 Cannon Drive West, Columbus, OH 43210']
        // ['Morrison Tower', '196 West 11th Ave., Columbus, OH 43210']
        // ['Neil Avenue', '1578 Neil Avenue, Columbus, OH 43201'],
        // ['Norton House', '2114 Neil Avenue, Columbus, OH 43210'],
        // ['Nosker House', '124 West Woodruff Avenue, Columbus, OH 43210'],
        // ['Park-Stradley Hall', '120 West 11th Avenue, Columbus, OH 43210'],
        // ['Paterson Hall', '191 West 12th Ave., Columbus, OH 43210'],
        // ['Pennsylvania Place', '1478 Pennsylvania Avenue, Columbus, OH 43201'],
        // ['Pomerene House', '231 West 10th Avenue, Columbus, OH 43201'],
        // ['Raney House', '33 W. Lane Avenue, Columbus, OH 43210'],
        // ['Scholars East', '221 West 10th Avenue, Columbus, OH 43201'],
        // ['Scholars West', '239 West 10th Avenue, Columbus, OH 43201'],
        // ['Scott House', '160 W. Woodruff Avenue, Columbus, OH 43210'],
        // ['Siebert Hall', '184 West 11th Ave., Columbus, OH 43210'],
        // ['Smith-Steeb Hall', '80 West 11th Avenue, Columbus, OH 43210'],
        // ['Taylor Tower', '55 W. Lane Ave, Columbus, OH 43210']
        // ['The Residence on Tenth', '230 West 10th Avenue, Columbus, OH 43201'],
        // ['Torres House', '187 W. Lane Avenue, Columbus, OH 43210'],
        // ['Veteran\'s House', '237 E 17th Ave, Columbus, OH 43201'],
        // ['Worthington Building', '203 West 10th Avenue, Columbus, OH 43201']];

        const dorms = ['130 Neil Avenue', '93 West 12th Avenue', '129 West 12th Avenue', '88 W. Woodruff Ave',
        '136 W. Woodruff Avenue', '2125 N. High Street', '221 West 12th Avenue', '2115 N. High Street',
        '236 West 11th Avenue', '191 W. Lane Avenue', '220 West 11th Avenue', '141 West 11th Avenue',
        '225 West 10th Avenue', '112 West Woodruff Avenue', '61 West Lane Avenue', '97 W. Lane Avenue',
        '123 W. Lane Ave', '328 West Lane Avenue', '1810 Cannon Drive West', '1698 Neil Avenue',
        '194 West Woodruff Ave.', '1900 Cannon Drive West', '196 West 11th Ave.', '1578 Neil Avenue',
        '2114 Neil Avenue', '124 West Woodruff Avenue', '120 West 11th Avenue', '191 West 12th Ave.',
        '1478 Pennsylvania Avenue', '231 West 10th Avenue', '33 W. Lane Avenue', '221 West 10th Avenue',
        '239 West 10th Avenue', '160 W. Woodruff Avenue', '184 West 11th Ave.', '80 West 11th Avenue',
        '55 W. Lane Ave', '230 West 10th Avenue', '187 W. Lane Avenue', '237 E 17th Ave', '203 West 10th Avenue'];
      
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
        if (googleMapsDistanceMatrixResult.destination_addresses[0] !== '') {
          // regex for parsing google miles string to integers
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
    }
  } catch (err) {
    console.log(err);
  }
};
