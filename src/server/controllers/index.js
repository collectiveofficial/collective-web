const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
const twilio = require('twilio');
const cron = require('cron');
const userUtil = require('../models/user');
const admin = require('firebase-admin');

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    // privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : process.env.FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

console.log(firebaseAdminApp);

module.exports = {
  checkUserEmail: {
    async post(req, res) {
      const email = req.body.email;
      const doesUserEmailExist = await userUtil.checkIfUserEmailExists(email);
      const hasUserFinishedSignUp = await userUtil.checkIfEmailUserFinishedSignUp(email);
      const isUserFacebookAuth = await userUtil.checkIfUserIsFacebookAuth(email);
      await res.json({
        isUserFacebookAuth,
        doesUserEmailExist,
        hasUserFinishedSignUp,
      });
    },
  },
  saveUserOnFacebookSignUp: {
    async post(req, res) {
      console.log(req.body);
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken)
      let uid = decodedToken.uid;
      const doesUserExist = await userUtil.checkIfUserExists(uid);
      req.body.uid = uid;
      if (doesUserExist) {
        const hasUserFinishedSignUp = await userUtil.checkIfFacebookUserFinishedSignUp(uid);
        await console.log('hasUserFinishedSignUp: ', hasUserFinishedSignUp);
        if (hasUserFinishedSignUp) {
          await res.json({
            saveUserOnFacebookSignUpExecuted: false,
            userAlreadyExists: true,
            hasUserFinishedSignUp: true,
          });
        } else {
          await res.json({
            saveUserOnFacebookSignUpExecuted: false,
            userAlreadyExists: true,
            hasUserFinishedSignUp: false,
          });
        }
      } else {
        await userUtil.addUserFromFacebookSignUp(req.body);
        await res.json({
          saveUserOnFacebookSignUpExecuted: true,
          userAlreadyExists: false,
          hasUserFinishedSignUp: false,
        });
      }
    },
  },
  saveUserOnEmailSignUp: {
    post(req, res) {
      console.log(req.body);
      admin.auth().verifyIdToken(req.body.firebaseAccessToken)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        console.log('firebaseDecodedToken: ', decodedToken);
        console.log('uid: ', uid);
        req.body.uid = uid;
        userUtil.addUserFromEmailSignUp(req.body);
        res.json({ saveUserOnEmailSignUpExecuted: true });
      }).catch(function(error) {
        // Handle error
        console.log(error);
      });
    },
  },
  settings: {
    get(req, res) {
      console.log('the server works');
      res.json('settings');
    },
  },
  validateEmail: {
    post(req, res) {
      const emailInput = req.body.emailInput;
      const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      };
      if (validateEmail(emailInput)) {
        res.json({ emailValidated: true });
      } else {
        res.json({ emailValidated: false });
      }
    },
  },
  validatePassword: {
    post(req, res) {
      const passwordInput = req.body.passwordInput;
      // Minimum eight characters, at least one letter and one number.
      const validatePassword = (password) => {
        const re = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/;
        return re.test(password);
      };
      if (!validatePassword(passwordInput)) {
        res.json({ passwordValidated: true });
      } else {
        res.json({ passwordValidated: false });
      }
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
        res.json({
          facebook_payload: response,
        });
      })
      .catch(err => console.log(err));
    },
  },
  submitUserInfo: {
    async post(req, res) {
      console.log('req.body', req.body);
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken)
      let uid = decodedToken.uid;
      const doesUserExist = await userUtil.checkIfUserExists(uid);
      req.body.uid = uid;
      await userUtil.saveSubmittedUserInfo(req.body);
      await res.json({ userSignedUp: true });
    },
  },
  facebookLogin: {
    async post(req, res) {
      console.log(req.body);
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken)
      let uid = decodedToken.uid;
      const doesUserExist = await userUtil.checkIfUserExists(uid);
      req.body.uid = uid;
      if (doesUserExist) {
        const hasUserFinishedSignUp = await userUtil.checkIfFacebookUserFinishedSignUp(uid);
        await console.log('hasUserFinishedSignUp: ', hasUserFinishedSignUp);
        if (hasUserFinishedSignUp) {
          await res.json({
            saveUserOnFacebookSignUpExecuted: false,
            userAlreadyExists: true,
            hasUserFinishedSignUp: true,
          });
        } else {
          await res.json({
            saveUserOnFacebookSignUpExecuted: false,
            userAlreadyExists: true,
            hasUserFinishedSignUp: false,
          });
        }
      } else {
        await userUtil.addUserFromFacebookSignUp(req.body);
        await res.json({
          saveUserOnFacebookSignUpExecuted: true,
          userAlreadyExists: false,
          hasUserFinishedSignUp: false,
        });
      }
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
