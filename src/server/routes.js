const path = require('path');

const router = require('express').Router();
const controller = require('./controllers');

// Connect controller methods to their corresponding routes
// router.get('/', (req, res) => {
//   console.log('Enter root.');
// });
router.get('/settings', controller.settings.get);
// router.get('/dbtest', controller.dbtest.get);

router.post('/auth/facebook', controller.facebookAuth.post);

module.exports = router;
