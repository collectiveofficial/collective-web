const Promise = require('bluebird');
const models = require('../../database/models/index');

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

module.exports.saveSubmittedUserInfo = function (user) {
  models.User.update({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    streetAddress: user.streetAddress,
    aptSuite: user.aptSuite,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    fullAddress: user.aptSuite.length > 0 ? `${user.streetAddress}, ${user.aptSuite}, ${user.city}, ${user.state}, ${user.zipCode}`:`${user.streetAddress}, ${user.city}, ${user.state} ${user.zipCode}`,
    hasUserFinishedSignUp: true,
  }, {
    where: {
      firebaseUID: user.uid,
    }
  })
  .catch(err => console.log(err));
};

// module.exports.removeBookmark = function (userId, slideId) {
//   models.Bookmark.destroy({
//     where: {
//       slide_id: slideId,
//       user_id: userId
//     }
//   })
//   .catch(err => console.log(err));
// };
//
// module.exports.checkIsSlideBookmarked = function (slideId, userId, callback) {
//   let isSlideBookmarked = false;
//   models.Bookmark.findOne({
//     where: {
//       slide_id: slideId,
//       user_id: userId
//     }
//   })
//   .then((bookmarkQueryResult) => {
//     if (bookmarkQueryResult !== null) {
//       isSlideBookmarked = true;
//     }
//     callback(null, isSlideBookmarked);
//   })
//   .catch(err => console.log(err));
// };
