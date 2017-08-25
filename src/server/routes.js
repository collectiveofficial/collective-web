const path = require('path');

const router = require('express').Router();
const controller = require('./controllers');

router.get('/settings', controller.settings.get);
router.get('/vote/notification', controller.voteNotification.get);
// router.get('/dbtest', controller.dbtest.get);
router.post('/auth/check', controller.checkUser.post);
router.post('/auth/email', controller.validateEmail.post);
router.post('/auth/password', controller.validatePassword.post);
router.post('/auth/facebook', controller.facebookAuth.post);
router.post('/auth/register-form/submit', controller.submitUserInfo.post);
router.post('/auth/signup/check-email', controller.checkUserEmail.post);
router.post('/auth/facebook/check', controller.saveUserOnFacebookSignUp.post);
router.post('/auth/signup/email-signup/save', controller.saveUserOnEmailSignUp.post);
router.post('/vote-ballot/get-ballot-votes', controller.getBallotUserVotes.post);
router.post('/delivery/qualify', controller.qualifyDelivery.post);
router.post('/vote/save', controller.saveVotes.post);
router.post('/vote/update', controller.updateVotes.post);
router.post('/transaction/check', controller.checkTransaction.post);
router.post('/confirm-payment', controller.confirmPayment.post);

module.exports = router;
