const path = require('path');

const router = require('express').Router();
const controller = require('./controllers');

router.get('/settings', controller.settings.get);
router.get('/vote/notification', controller.voteNotification.get);
// router.get('/dbtest', controller.dbtest.get);

router.post('/auth/facebook', controller.facebookAuth.post);

module.exports = router;
