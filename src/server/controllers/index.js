const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
var firebase = require("firebase");
const db = require(__dirname + '/../../database/models/index.js')
const twilio = require('twilio');
const cron = require('cron');


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
        response = JSON.parse(response);
        db.User.create({
          firstName: response.first_name,
          lastName: response.last_name,
          email: response.email,
          phoneNumber: null,
          birthday: null,
          streetAddress: null,
          aptSuite: null,
          city: null,
          state: null,
          zipCode: null,
          fullAddress: null,
          subscribed: false,
          userGroupId: null
      })
        res.json({
          facebook_payload: response,
        });
      })
      .catch(err => console.log(err));
    },
  },
  voteNotification: {
    get(req, res) {
      // date: "26 August 2017 from 9am to Noon",
      // vote: "Voting window is from 21 August to 25 August",
      // remainingCalendar: [
      //   ['9 September 2017',  "Voting window is from 27 August to 7 September"],
      // ['23 September 2017',  "Voting window is from 10 September to 21 September"],
      // ['7 October 2017',  "Voting window is from 24 September to 5 October"],
      // ['28 October 2017',  "Voting window is from 8 October to 26 October"],
      // ['10 November 2017', "Voting window is from 29 October to 8 November"],
      // ['2 December 2017',  "Voting window is from 11 November to 30 November"]
      // ]
      // const dropDates = {
      //   '26 August 2017': {
      //     time: '9 AM to Noon',
      //   }
      // };
      // '00 56 9 27 7 * *'
      const job1 = new cron.CronJob('00 03 13 * * *', () => {
        /* runs once at the specified date. */
        console.log('job 1 ticked');
        const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
        const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

        const client = new twilio(accountSid, authToken);

        client.messages.create({
          body: 'Collective here! Best Food Forward\'s food voting is ending on Friday, 7/28/17. Make sure to get your votes in!',
          to: '+14083244163',  // Text this number
          from: `+${process.env.TWILIO_PHONE_NUMBER}`, // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
      }, () => {
        /* This function is executed when the job stops */
        console.log('mission accomplished');
      },
      true, /* Start the job right now */
      'America/Los_Angeles'); /* Time zone of this job. */

    console.log('job1 status', job1.running); // job1 status undefined
    },
  },
  dbtest: {
    get(req, res) {

    },
  },
};
