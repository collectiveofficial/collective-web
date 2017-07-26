const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
var firebase = require("firebase");

module.exports = {
  settings: {
    get(req, res) {
      console.log('the server works');
      res.json('settings');
    },
  },
  facebookAuth: {
    post(req, res) {
      console.log('token from server', req.body.facebook_token);
      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        uri: `https://graph.facebook.com/me?fields=email,first_name,last_name,picture&access_token=${req.body.facebook_token}`,
      };

      // Get the user's name using Facebook's Graph API
      request(options)
      .then((response) => {
        response = JSON.parse(response); //NOTE TO SELF 2: Yes we're idiots
        console.log('response from graph API: ', response);
        res.json({
          facebook_payload: response,
        });
      })
      .catch(err => console.log(err));
    },
  },
  dbtest: {
    get(req, res) {

    },
  },
};
