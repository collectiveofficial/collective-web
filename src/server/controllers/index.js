const path = require('path');
const request = require('request-promise')

module.exports = {
  settings: {
    get(req, res) {
      console.log('the server works');
      res.json('settings');
    },
  },
  facebookAuth: {

  },
  dbtest: {
    get(req, res) {

    },
  },
};
