const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
const twilio = require('twilio');
const cron = require('cron');
const fs = require('fs');
const userUtil = require('../models/user');
const dropoffUtil = require('../models/dropoff');
const foodUtil = require('../models/food');
const ballotUtil = require('../models/ballot');
const voteUtil = require('../models/vote');
const transactionUtil = require('../models/transaction');
const groupUtil = require('../models/group');
const admin = require('firebase-admin');
const json2csv = require('json2csv');
const moment = require('moment-timezone');
const configureStripe = require('stripe');
let STRIPE_SECRET_KEY;

if (process.env.NODE_ENV === 'production') {
  STRIPE_SECRET_KEY = process.env.sk_live_MY_SECRET_KEY;
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

const firstDropoff = {
  id: 1,
  intendedShipDate: '2017-08-26',
  intendedPickupTimeStart: moment.tz('2017-08-26 09:00:00', 'America/New_York'),
  intendedPickupTimeEnd: moment.tz('2017-08-26 12:00:00', 'America/New_York'),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-08-11 00:00:00', 'America/New_York'),
  voteDateTimeEnd: moment.tz('2017-08-23 23:59:59', 'America/New_York'),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 10,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0.05,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
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
  imageUrl: 'https://world-food-and-wine.com/image-files/white-grapes.jpg',
},
{
  name: 'Carrots',
  imageUrl: 'http://edge.alluremedia.com.au/uploads/businessinsider/2015/12/baby-carrots.jpg',
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

// this.state = {
//   date: "26 August 2017 from 9am to Noon",
//   vote: "Voting window is from 11 August at 12:00 AM to 23 August at 11:59 PM",
//   remainingCalendar: [
//     ['9 September 2017',  "Voting window is from 24 August at 12:00 AM to 6 September at 11:59 PM"],
//   ['23 September 2017',  "Voting window is from 7 September at 12:00 AM to 20 September at 11:59 PM"],
//   ['7 October 2017',  "Voting window is from 21 September at 12:00 AM to 4 October at 11:59 PM"],
//   ['28 October 2017',  "Voting window is from 5 October at 12:00 AM to 25 October at 11:59 PM"],
//   ['10 November 2017', "Voting window is from 26 October at 12:00 AM to 8 November at 11:59 PM"],
//   ['2 December 2017',  "Voting window is from 9 November at 12:00 AM to 29 November at 11:59 PM"]
//   ],
//   items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
//   provider: "DNO Produce",
//   //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
//   location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university",
// };

const secondDropoff = {
  id: 2,
  intendedShipDate: '2017-09-09',
  intendedPickupTimeStart: moment.tz('2017-09-09 09:00:00', 'America/New_York'),
  intendedPickupTimeEnd: moment.tz('2017-09-09 12:00:00', 'America/New_York'),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-08-24 00:00:00', 'America/New_York'),
  voteDateTimeEnd: moment.tz('2017-09-06 23:59:59', 'America/New_York'),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 10,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0.05,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
};


['Green Peppers', 'Honeydews', 'Papayas', 'Pears', 'Raspberries', 'Watermelon', 'Asparagus', 'Kiwi', 'Cabbage', 'Kale', 'Collards', 'Cucumbers', 'Tomato', 'Corn', 'Lettuce', 'Apples', 'Sweet Potatoes', 'Oranges', 'Bananas'];

const secondDropFoodItems = [
  {
    name: 'Green Peppers',
    imageUrl: 'https://goo.gl/fyjxBH',
    // imageUrl: 'https://i.warosu.org/data/ck/img/0054/27/1399844907702.jpg',
  },
  {
    name: 'Honeydews',
    imageUrl: 'https://goo.gl/yBWwRM',
    // imageUrl: 'http://servingjoy.com/wp-content/uploads/2014/12/Slice-of-Honeydew-Melon.jpg',
  },
  {
    name: 'Papaya',
    imageUrl: 'https://goo.gl/UFxCQJ',
    // imageUrl: 'http://juicing-for-health.com/wp-content/uploads/2012/06/papaya1.jpg',
  },
  {
    name: 'Pears',
    imageUrl: 'https://goo.gl/KwwJ81',
    // imageUrl: 'http://www.liversupport.com/wp-content/uploads/2015/09/pears-can-assist-your-liver-999x576.jpg',
  },
  {
    name: 'Raspberries',
    imageUrl: 'https://goo.gl/FS3KJR',
    // imageUrl: 'http://wtop.com/wp-content/uploads/2017/06/raspberries-1880x1254.jpg',
  },
  {
    name: 'Watermelon',
    imageUrl: 'https://goo.gl/cSPZwi',
    // imageUrl: 'http://www.well-beingsecrets.com/wp-content/uploads/How-to-Buy-and-Store-Watermelon.jpg',
  },
  {
    name: 'Asparagus',
    imageUrl: 'https://goo.gl/GdYJ1D',
    // imageUrl: 'http://www.oahufresh.com/wp-content/uploads/2016/08/asparagus.jpg',
  },
  {
    name: 'Kiwi',
    imageUrl: 'https://goo.gl/bzMN3v',
    // imageUrl: 'https://aos.iacpublishinglabs.com/question/aq/1400px-788px/kiwi-citrus-fruit_2411b9e870d212a5.jpg?domain=cx.aos.ask.com',
  },
  {
    name: 'Cabbage',
    imageUrl: 'https://goo.gl/zYk9MV',
    // imageUrl: 'https://fthmb.tqn.com/_T98MEySnrgcOOK879GS7PvJBg0=/2000x1500/filters:no_upscale()/about/Cabbage-GettyImages-683732681-586599443df78ce2c32dd4c3.jpg',
  },
  {
    name: 'Kale',
    imageUrl: 'https://goo.gl/5QJdLK',
    // imageUrl: 'http://www.vegkitchen.com/wp-content/uploads/2012/12/Kale-in-a-basket.jpg',
  },
  {
    name: 'Collards',
    imageUrl: 'https://goo.gl/PaUpGv',
    // imageUrl: 'https://ronemyhoustonmajic.files.wordpress.com/2015/04/171305080.jpg',
  },
  {
    name: 'Cucumbers',
    imageUrl: 'https://goo.gl/UDqsdB',
    // imageUrl: 'http://www.movenoticias.com/wp-content/uploads/2017/06/pepino-fatiado.jpg',
  },
  {
    name: 'Tomato',
    imageUrl: 'https://goo.gl/XL4rzh',
    // imageUrl: 'http://ichef.bbci.co.uk/wwfeatures/wm/live/1280_640/images/live/p0/4w/46/p04w46sp.jpg',
  },
  {
    name: 'Corn',
    imageUrl: 'https://goo.gl/8SqA6z',
    // imageUrl: 'https://thumbs.mic.com/ODU4ODMwNjZlMiMvd2w1NjJaZFk4RnFkZDk3cW12bzFLejVoaUwwPS82MXgzNTY6NDIyN3gyNDkyLzE2MDB4OTAwL2ZpbHRlcnM6Zm9ybWF0KGpwZWcpOnF1YWxpdHkoODApL2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9wb2xpY3ltaWMtaW1hZ2VzL3g3dzZtb2d2aHRnb21qYnNyZWhoc2x3YWY0OGgxY2UzOHdxcGRnZ254em12OXBxNnZnZGt4eDdvb2llZGxuNXUuanBn.jpg',
  },
  {
    name: 'Lettuce',
    imageUrl: 'https://goo.gl/7G9jB9',
    // imageUrl: 'http://s.eatthis-cdn.com/media/images/ext/724422176/napacabbage-healthier-than-kale.jpg',
  },
  {
    name: 'Apples',
    imageUrl: 'https://goo.gl/W6YmQZ',
    // imageUrl: 'http://www.ultrahdfreewallpapers.com/uploads/large/fruits/apple-fruit-hd-wallpaper-0041.jpg',
  },
  {
    name: 'Sweet Potatoes',
    imageUrl: 'https://goo.gl/jEiem5',
    // imageUrl: 'http://nutritionstudies.org/wp-content/uploads/2015/05/recipe-oh-so-sweet-potatoes.jpg',
  },
  {
    name: 'Oranges',
    imageUrl: 'https://goo.gl/ZAeoZD',
    // imageUrl: 'https://img.maximummedia.ie/her_ie/eyJkYXRhIjoie1widXJsXCI6XCJodHRwOlxcXC9cXFwvbWVkaWEtaGVyLm1heGltdW1tZWRpYS5pZS5zMy5hbWF6b25hd3MuY29tXFxcL3dwLWNvbnRlbnRcXFwvdXBsb2Fkc1xcXC8yMDE3XFxcLzAyXFxcLzIxMTUzOTI2XFxcL29yYW5nZXMuanBnXCIsXCJ3aWR0aFwiOjY0NyxcImhlaWdodFwiOjM0MCxcImRlZmF1bHRcIjpcImh0dHBzOlxcXC9cXFwvd3d3Lmhlci5pZVxcXC9hc3NldHNcXFwvaW1hZ2VzXFxcL2hlclxcXC9uby1pbWFnZS5wbmc_dj0zXCJ9IiwiaGFzaCI6ImZiMzYzNTI2YzhmYTI4OWI4YjY0MWFkODI5OGZjNzRkNjI1NTAwMzEifQ==/oranges.jpg',
  },
  {
    name: 'Bananas',
    imageUrl: 'https://goo.gl/VvMUcM',
    // imageUrl: 'https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?quality=85',
  },
];

const firstGroup = {
  name: 'Ohio State University, Columbus',
  type: 'university',
  streetAddress: '160 W Woodruff Ave',
  aptSuite: 'Building 1108',
  city: 'Columbus',
  state: 'OH',
  zipCode: '43210',
  descriptor: 'Best Food Forward is made for students by students, utilizing a democratic, cooperative framework to make it easier for people to eat healthy.',
  // TODO: dynamic dropoff ID (current datetime)
  currentDropoffID: 1,
  // TODO: dynamic voting dropoff ID (current datetime)
  currentVotingDropoffID: 1,
  deliveryStreetAddress: '160 W Woodruff Ave',
  deliveryAptSuite: 'Building 1108',
  deliveryCity: 'Columbus',
  deliveryState: 'OH',
  deliveryZipCode: '43210',
};

const initializeData = async () => {
  const initializeFirstGroup = async () => {
    // initialize group
    const doesFirstGroupExist = await groupUtil.doesFirstGroupExist();
    // if group at id 1 does not exist
    if (!doesFirstGroupExist) {
      await groupUtil.populateGroup(firstGroup);
    }
  };

  const updateCurrentDropoffID = async () => {
    // TODO: dynamic voting dropoff ID (current datetime)
    const currentDropoffID = 2;
    const groupID = 1;
    await groupUtil.updateCurrentDropoffID(currentDropoffID, groupID);
  };
  //
  // const updateCurrentVotingDropoffID = async () => {
  //   // TODO: dynamic voting dropoff ID (current datetime)
  //   const currentVotingDropoffID = 1;
  //   const groupID = 1;
  //   await groupUtil.updateCurrentVotingDropoffID(currentVotingDropoffID, groupID);
  // };

  const updateFirstDropoffVoteTimeEnd = async () => {
    const dropoffID = 1;
    const newTime = moment.tz('2017-08-23 23:59:59', 'America/New_York');
    await dropoffUtil.updateFirstDropoffVoteTimeEnd(dropoffID, newTime);
  };

  const initializeFirstDropoff = async () => {
    const dropoffID = 1;
    // initialize dropoff
    const doesFirstDropoffExist = await dropoffUtil.doesDropoffExist(dropoffID);
    // if dropoff at id 1 does not exist
    if (!doesFirstDropoffExist) {
      await dropoffUtil.populateDropoff(firstDropoff);
    }
  };

  const initializeSecondDropoff = async () => {
    const dropoffID = 2;
    // initialize dropoff
    const doesSecondDropoffExist = await dropoffUtil.doesDropoffExist(dropoffID);
    // if dropoff at id 1 does not exist
    if (!doesSecondDropoffExist) {
      await dropoffUtil.populateDropoff(secondDropoff);
    }
  };

  const initializeFirstDropFoodItemsBallots = async () => {
    const ballotID = 1;
    const foodID = 1;
    const doesFoodItemExist = await foodUtil.doesFoodItemExist(foodID);
    if (!doesFoodItemExist) {
      await foodUtil.populateFoodItemsBallots(firstDropFoodItems, ballotID, firstDropoff);
    }
  };

  const initializeSecondDropFoodItemsBallots = async () => {
    const ballotID = 2;
    const doesPapayaExist = await foodUtil.doesPapayaExist();
    if (!doesPapayaExist) {
      await foodUtil.populateFoodItemsBallots(secondDropFoodItems, ballotID, secondDropoff);
    }
  };

  const updateDeliveryAddressForGroup = async () => {
    // TODO: dynamic groupID
    const groupID = 1;
    const deliveryAddress = {
      deliveryStreetAddress: '160 W Woodruff Ave',
      deliveryAptSuite: 'Building 1108',
      deliveryCity: 'Columbus',
      deliveryState: 'OH',
      deliveryZipCode: '43210',
    };
    await groupUtil.updateDeliveryAddressForGroup(groupID, deliveryAddress)
  };

  const sendNightlyCSVupdates = async () => {
    // TODO: dynamic dropoffID
    const dropoffID = 1;
    let fields;
    let csv;
    let fileName;

    const sendFoodNamesAndVoteCounts = async () => {
      // just food name and vote count for now
      fields = ['Food Name', 'Vote Count'];
      const foodNamesAndVoteCounts = await ballotUtil.getFoodNamesAndVoteCounts(dropoffID);
      csv = json2csv({ data: foodNamesAndVoteCounts, fields });
      fileName = 'foodNamesAndVoteCounts.csv';
      await fs.writeFile(__dirname + `/../adminData/${fileName}`, csv, (err) => {
        if (err) {
          console.log('file failed to create');
          throw err;
        }
        console.log('file created');
      });
    };

    const sendUserNamesAndPackagesOrdered = async () => {
      fields = ['Last Name', 'First Name', 'Email', 'Phone Number', 'Dorm Packages Ordered', 'Cooking Packages Ordered'];
      // csv in ascending alphabetical order
      const userInfoAndPackagesOrdered = await transactionUtil.getUserInfoAndPackagesOrdered(dropoffID);
      csv = json2csv({ data: userInfoAndPackagesOrdered, fields });
      fileName = 'userNamesAndPackagesOrdered.csv';
      await fs.writeFile(__dirname + `/../adminData/${fileName}`, csv, (err) => {
        if (err) {
          console.log('file failed to create');
          throw err;
        }
        console.log('file created');
      });
    };
    await sendFoodNamesAndVoteCounts();
    await sendUserNamesAndPackagesOrdered();
  };

  const sendVotingReminderCSVupdates = async () => {
    const fields = ['Last Name', 'First Name', 'Email'];
    // TODO: dynamic groupID
    const groupID = 1;
    const dropoffID = 1;
    const usersWhoHaveNotPaid = await transactionUtil.getUsersWhoHaveNotPaid(dropoffID, groupID);
    const csv = json2csv({ data: usersWhoHaveNotPaid, fields });
    const fileName = 'usersWhoHaveNotPaid.csv';
    await fs.writeFile(__dirname + `/../adminData/${fileName}`, csv, (err) => {
      if (err) {
        console.log('file failed to create');
        throw err;
      }
      console.log('file created');
    });
  };

  await initializeFirstGroup();
  await updateCurrentDropoffID();
  // await updateCurrentVotingDropoffID();
  await initializeFirstDropoff();
  await initializeFirstDropFoodItemsBallots();
  await updateFirstDropoffVoteTimeEnd();
  await initializeSecondDropoff();
  await initializeSecondDropFoodItemsBallots();
  await updateDeliveryAddressForGroup();
  await sendNightlyCSVupdates();
  await sendVotingReminderCSVupdates();
};

initializeData();

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
      // TODO: Implement dynamic dropoffID
      req.body.dropoffID = 2;
      const ballotsAndVotes = await ballotUtil.getBallotUserVotes(req.body);
      const userTransactionHistory = await transactionUtil.getUserTransactionHistory(uid);
      console.log('------> userTransactionHistory: ', userTransactionHistory);
      const responseObject = {
        ballotsAndVotes,
        userTransactionHistory,
      };
      await res.json(responseObject);
    },
  },
  qualifyDelivery: {
    async post(req, res) {
      // const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      // let uid = decodedToken.uid;
      // req.body.uid = uid;
      const isUserQualifiedForDelivery = await userUtil.checkIfUserQualifiedForDelivery(req.body);
      res.json({ isUserQualifiedForDelivery });
    },
  },
  saveVotes: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: Implement dynamic dropoffID
      req.body.dropoffID = 2;
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
  confirmPayment: {
    async post(req, res) {
      console.log(req.body);
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: dynamic dropoffID
      const dropoffID = 2;
      req.body.pctFeePerPackage = await dropoffUtil.findPctFeePerPackageForDrop(dropoffID);
      req.body.cookingPackageFees = (req.body.cookingPackagesOrdered * 10) * req.body.pctFeePerPackage;
      req.body.transactionFee = req.body.cookingPackagesOrdered > 0 ? 0.5 : 0;
      const totalDollarAmount = (req.body.dormPackagesOrdered * 6) + ((req.body.cookingPackagesOrdered * 10) + req.body.cookingPackageFees) + req.body.transactionFee;
      req.body.totalDollarAmount = totalDollarAmount;
      const dormPackageEmailDescription = req.body.dormPackagesOrdered > 0 ? `${req.body.dormPackagesOrdered} x Dorm Package${req.body.dormPackagesOrdered < 2 ? '' : 's'}` : '';
      const cookingPackageEmailDescription = req.body.cookingPackagesOrdered > 0 ? `${req.body.cookingPackagesOrdered} x Cooking Package${req.body.cookingPackagesOrdered < 2 ? '' : 's'}` : '';
      const conditionalNextLine = req.body.dormPackagesOrdered > 0 && req.body.cookingPackagesOrdered > 0 ? '\n' : '';
      const description = `${dormPackageEmailDescription}${conditionalNextLine}${cookingPackageEmailDescription}`;
      let charge = await stripe.charges.create({
        amount: Math.round(totalDollarAmount * 100),
        currency: 'usd',
        card: req.body.token.id,
        description,
        receipt_email: req.body.email, // will only send in production, must go to dashboard to send test receipts from test Payments
      }, async (err, charge) => {
        if (err) {
          console.log(err);
        } else {
          await transactionUtil.savePaymentInfo(req.body, dropoffID);
          await res.json({ paymentCompleted: true, emailSentTo: req.body.email });
        }
      });
    },
  },
  checkTransaction: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: Implement dynamic dropoffID
      req.body.dropoffID = 2;
      const checkTransactionResult = await transactionUtil.checkTransaction(req.body);
      res.json(checkTransactionResult);
    },
  },
  voteNotification: {
    get(req, res) {
      // this.state = {
      //   date: "26 August 2017 from 9am to Noon",
      //   vote: "Voting window is from 11 August at 12:00 AM to 23 August at 11:59 PM",
      //   remainingCalendar: [
      //     ['9 September 2017',  "Voting window is from 24 August at 12:00 AM to 6 September at 11:59 PM"],
      //   ['23 September 2017',  "Voting window is from 7 September at 12:00 AM to 20 September at 11:59 PM"],
      //   ['7 October 2017',  "Voting window is from 21 September at 12:00 AM to 4 October at 11:59 PM"],
      //   ['28 October 2017',  "Voting window is from 5 October at 12:00 AM to 25 October at 11:59 PM"],
      //   ['10 November 2017', "Voting window is from 26 October at 12:00 AM to 8 November at 11:59 PM"],
      //   ['2 December 2017',  "Voting window is from 9 November at 12:00 AM to 29 November at 11:59 PM"]
      //   ],
      //   items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
      //   provider: "DNO Produce",
      //   //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
      //   location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university",
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
