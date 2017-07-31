const Promise = require('bluebird');
const models = require('../../database/models/index');

module.exports.addUser = function (user) {
  models.User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    birthday: user.birthday,
    streetAddress: user.streetAddress,
    aptSuite: user.aptSuite,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
    fullAddress: user.aptSuite.length > 0 ? `${user.streetAddress}, ${user.aptSuite}, ${user.city}, ${user.state}, ${user.zipCode}`:`${user.streetAddress}, ${user.city}, ${user.state} ${user.zipCode}`,
    subscribed: false,
    // userGroupId: user.
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
