const path = require('path');

const router = require('express').Router();
const controller = require('./controllers');

router.get('/settings', controller.settings.get);
router.get('/vote/notification', controller.voteNotification.get);
// router.get('/dbtest', controller.dbtest.get);
router.post('/auth/email', controller.validateEmail.post);
router.post('/auth/password', controller.validatePassword.post);
router.post('/auth/facebook', controller.facebookAuth.post);
router.post('/auth/register-form/submit', controller.submitUserInfo.post);
router.post('/auth/signup/check-email', controller.checkUserEmail.post);
router.post('/auth/signup/facebook/save', controller.saveUserOnFacebookSignUp.post);
router.post('/auth/signup/email-signup/save', controller.saveUserOnEmailSignUp.post);

module.exports = router;
