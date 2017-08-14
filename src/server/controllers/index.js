const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
const twilio = require('twilio');
const cron = require('cron');
const userUtil = require('../models/user');
const dropoffUtil = require('../models/dropoff');
const foodUtil = require('../models/food');
const ballotUtil = require('../models/ballot');
const voteUtil = require('../models/vote');
const paymentUtil = require('../models/payment');
const admin = require('firebase-admin');
const moment = require('moment-timezone');
const configureStripe = require('stripe');
let STRIPE_SECRET_KEY;

if (process.env.NODE_ENV === 'production') {
  STRIPE_SECRET_KEY = process.env.sk_test_MY_SECRET_KEY;
} else {
  STRIPE_SECRET_KEY = process.env.sk_test_MY_SECRET_KEY;
}

const stripe = configureStripe(STRIPE_SECRET_KEY);

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // privateKey: process.env.FIREBASE_PRIVATE_KEY,
    privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : process.env.FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const intendedPickupTimeStart = moment.tz('2017-08-26 09:00:00', 'America/New_York');
const intendedPickupTimeEnd = moment.tz('2017-08-26 12:00:00', 'America/New_York');
const voteDateTimeBeg = moment.tz('2017-08-11 09:00:00', 'America/New_York');
const voteDateTimeEnd = moment.tz('2017-08-23 12:00:00', 'America/New_York');

const firstDropoff = {
  intendedShipDate: '2017-08-26',
  intendedPickupTimeStart,
  intendedPickupTimeEnd,
  shipDate: null,
  voteDateTimeBeg,
  voteDateTimeEnd,
  pricePerDormPackage: 6,
  pricePerCookingPackage: 10,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0.05,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
};

const firstDropFoodItems = [{
  name: 'Sweet Potatoes',
  imageUrl: 'https://i2.wp.com/bonnieplants.com/wp-content/uploads/2011/10/sweet-potatoes-harvest.jpg?ssl=1',
},
{
  name: 'Potatoes',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg',
},
{
  name: 'Kiwis',
  imageUrl: 'http://cdn.thealternativedaily.com/wp-content/uploads/2013/11/kiwi.jpg',
},
{
  name: 'Oranges',
  imageUrl: 'http://grapplergourmet.com/wp-content/uploads/2015/03/piles.jpg',
},
{
  name: 'Granny Smith Apples',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Granny_smith.jpg/220px-Granny_smith.jpg',
},
{
  name: 'Golden Delicious Apples',
  imageUrl: 'https://sc01.alicdn.com/kf/UT88x55XFFaXXagOFbXL/Golden-Delicious-Apples-Best-Quality-and-best.jpg',
},
{
  name: 'Pink Lady Apples',
  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQafjY4RXhQCk40caqUGSRtmzkK0hu_RQQ_zR1v3nWAkRSvvSgTsA',
},
{
  name: 'Bananas',
  imageUrl: 'https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?w=720',
},
{
  name: 'Red Grapes',
  imageUrl: 'https://blackmoonejuice.com/wp-content/uploads/2014/05/grapes.jpg',
},
{
  name: 'White Grapes',
  imageUrl: 'http://world-food-and-wine.com/image-files/white-grapes.jpg',
},
{
  name: 'Carrots',
  imageUrl: 'https://edge.alluremedia.com.au/uploads/businessinsider/2015/12/baby-carrots.jpg',
},
{
  name: 'Spinach',
  imageUrl: 'http://healthyrise.com/wp-content/uploads/2016/07/Spinach.jpg',
},
{
  name: 'Red Peppers',
  imageUrl: 'http://www.ibizeneco.com/communities/1/004/013/082/201/images/4621089873.jpg',
},
{
  name: 'Green Peppers',
  imageUrl: 'http://palmaworld.com/wp-content/uploads/2017/01/green-pepper.jpg',
}];

const initializeFirstDropoff = async () => {
  // initialize dropoff
  const doesFirstDropoffExist = await dropoffUtil.doesFirstDropoffExist();
  // if dropoff at id 1 does not exist
  if (!doesFirstDropoffExist) {
    await dropoffUtil.populateDropoff(firstDropoff);
  }
};

const initializeFirstDropFoodItems = async () => {
  const doesFoodItemExist = await foodUtil.doesFoodItemExist();
  if (!doesFoodItemExist) {
    await foodUtil.populateFoodItems(firstDropFoodItems);
  }
};

const initializeFirstDropBallots = async () => {
  const doesBallotExist = await ballotUtil.doesBallotExist();
  if (!doesBallotExist) {
    // populate ballots first drop's food items for first dropoff
    await ballotUtil.populateBallots(1, voteDateTimeBeg, voteDateTimeEnd);
  }
};

initializeFirstDropoff();
initializeFirstDropFoodItems();
initializeFirstDropBallots();

console.log(firebaseAdminApp);

module.exports = {
  checkUser: {
    async post(req, res) {
      const firebaseAccessToken = req.body.firebaseAccessToken;
      // const hasUserFinishedSignUp = await userUtil.checkIfUserFinishedSignUp(firebaseAccessToken);
      const decodedToken = await admin.auth().verifyIdToken(firebaseAccessToken);
      let uid = decodedToken.uid;
      const userAuthorized = await userUtil.checkIfUserAuthorized(uid);
      res.json({ userAuthorized });
    },
  },
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
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
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
  confirmPayment: {
    async post(req, res) {
      console.log(req.body);
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: dynamic dropoffID
      const dropoffID = 1;
      const pctFeePerPackage = dropoffUtil.findPctFeePerPackageForDrop(dropoffID);
      req.body.pctFeePerPackage = pctFeePerPackage;
      const totalDollarAmount = req.body.price + 0.5 + (req.body.price * req.body.pctFeePerPackage);
      req.body.totalDollarAmount = totalDollarAmount;
      let charge = await stripe.charges.create({
        amount: totalDollarAmount * 100,
        currency: 'usd',
        card: req.body.token.id,
        description: req.body.email,
      }, async (err, charge) => {
        if (err) {
          // console.log(JSON.stringify(err, null, 2));
          console.log(err);
        } else {
          await paymentUtil.savePaymentInfo(req.body, dropoffID);
          await res.json({ paymentCompleted: true, emailSentTo: req.body.email });
        }
      });
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
  getBallotUserVotes: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      const ballotsAndVotes = await ballotUtil.getBallotUserVotes(req.body);
      const responseObject = {
        ballotsAndVotes,
      };
      await res.json(responseObject);
    },
  },
  saveVotes: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // invoke vote util function that takes in the request body as an argument
      await voteUtil.saveVotes(req.body);
      res.json({ votesSaved: true });
    },
  },
  updateVotes: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // invoke vote util function that takes in the request body as an argument
      await voteUtil.updateVotes(req.body);
      res.json({ votesSaved: true });
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
