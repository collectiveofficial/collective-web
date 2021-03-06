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
router.post('/vote/update', controller.updateVotes.post);
router.post('/transaction/check', controller.checkTransaction.post);
router.post('/payment-votes/save', controller.savePaymentVotes.post);
router.post('/admin/pickup/checkoff-user', controller.checkOffUser.post);
router.post('/admin/data-file/download', controller.downloadDataFile.post);
router.post('/admin/new-bulk-buy/submit', controller.submitNewBulkBuy.post);

module.exports = router;
