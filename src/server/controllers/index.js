const path = require('path');
const request = require('request-promise');
const dotenv = require('dotenv').config();
const twilio = require('twilio');
const cron = require('cron');
const fs = require('fs');
const QRCode = require('qrcode');
const userUtil = require('../models/user');
const dropoffUtil = require('../models/dropoff');
const foodUtil = require('../models/food');
const ballotUtil = require('../models/ballot');
const voteUtil = require('../models/vote');
const transactionUtil = require('../models/transaction');
const groupUtil = require('../models/group');
const restrictedAddressUtil = require('../models/restricted-address');
const admin = require('firebase-admin');
const json2csv = require('json2csv');
const configureStripe = require('stripe');
const google = require('googleapis');
const nodemailer = require('nodemailer');
const ReactDOMServer = require('react-dom/server');
require('babel-register');
const EmailReceipt = require('./EmailReceipt')
const { restrictedAddresses, firstDropoff, firstDropFoodItems, secondDropoff, secondDropFoodItems, thirdDropoff, thirdDropoffFoodItems, firstGroup } = require('./local-db-initialize-data');
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

const initializeData = async () => {
  const initializeFirstGroup = async () => {
    // initialize group
    const doesFirstGroupExist = await groupUtil.doesFirstGroupExist();
    // if group at id 1 does not exist
    if (doesFirstGroupExist === false) {
      await groupUtil.populateGroup(firstGroup);
    }
  };

  const updateCurrentDropoffID = async () => {
    // TODO: dynamic voting dropoff ID (current datetime)
    const currentDropoffID = 3;
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

  const initializeFirstDropoff = async () => {
    const dropoffID = 1;
    // initialize dropoff
    const doesFirstDropoffExist = await dropoffUtil.doesDropoffExist(dropoffID);
    // if dropoff at id 1 does not exist
    if (doesFirstDropoffExist === false) {
      await dropoffUtil.populateDropoff(firstDropoff);
    }
  };

  const initializeSecondDropoff = async () => {
    const dropoffID = 2;
    // initialize dropoff
    const doesSecondDropoffExist = await dropoffUtil.doesDropoffExist(dropoffID);
    // if dropoff at id 1 does not exist
    if (doesSecondDropoffExist === false) {
      await dropoffUtil.populateDropoff(secondDropoff);
    }
  };

  const initializeThirdDropoff = async () => {
    const dropoffID = 3;
    // initialize dropoff
    const doesThirdDropoffExist = await dropoffUtil.doesDropoffExist(dropoffID);
    // if dropoff at id 1 does not exist
    if (doesThirdDropoffExist === false) {
      await dropoffUtil.populateDropoff(thirdDropoff);
    }
  };

  const initializeFirstDropFoodItemsBallots = async () => {
    const ballotID = 1;
    const foodID = 1;
    const doesFoodItemExist = await foodUtil.doesFoodItemExist(foodID);
    if (doesFoodItemExist === false) {
      await foodUtil.populateFoodItemsBallots(firstDropFoodItems, ballotID, firstDropoff);
    }
  };

  const initializeSecondDropFoodItemsBallots = async () => {
    const doesPapayaExist = await foodUtil.doesPapayaExist();
    if (doesPapayaExist === false) {
      await foodUtil.populateFoodItemsBallots(secondDropFoodItems, null, secondDropoff);
    }
  };

  const initializeThirdDropFoodItemsBallots = async () => {
    const doesLimesExist = await foodUtil.doesLimesExist();
    if (doesLimesExist === false) {
      await foodUtil.populateFoodItemsBallots(thirdDropoffFoodItems, null, thirdDropoff);
    }
  };

  const initializeRestrictedAddresses = async () => {
    const groupID = 1;
    const dropoffID = 3;
    const restrictedAddressesID = 1;
    const doesRestrictedAddressExist = await restrictedAddressUtil.checkIfRestrictedAddressExist(restrictedAddressesID);
    if (doesRestrictedAddressExist === false) {
      await restrictedAddressUtil.initializeRestrictedAddresses(restrictedAddresses, groupID, dropoffID);
    }
  };

  const sendNightlyCSVupdates = async () => {
    // TODO: dynamic dropoffID
    const dropoffID = 2;
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
      fields = ['Last Name', 'First Name', 'Date of Birth', 'Email', 'Phone Number', 'Dorm Packages Ordered', 'Cooking Packages Ordered', 'Allergies', 'Delivery Address'];
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
    const dropoffID = 2;
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

  const testConfirmationEmail = async () => {
    try {
      const dropoffID = 3;
      // get rid of later
      const userID = 1;
      const userInfoForPickup = await transactionUtil.getUserInfoForPickup(dropoffID, null, userID);
      const qrFile = __dirname + `/../adminData/qr.png`;
      await QRCode.toFile(qrFile, JSON.stringify(userInfoForPickup), (err) => {
        console.log(err);
      });
      const jwtClient = await new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.NODE_ENV === 'production' ? JSON.parse(process.env.GOOGLE_SERVICE_PRIVATE_KEY) : process.env.GOOGLE_SERVICE_PRIVATE_KEY,
        ['https://mail.google.com/'], // an array of auth scopes
        'support@collectivefoods.com'
      );
      await jwtClient.authorize(async (err, token) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('\n\ntoken: ', token);
        const emailBody = 'Hi Johnny, here\'s the QR';

        const transporter = await nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            type: 'OAuth2',
            user: 'support@collectivefoods.com',
            serviceClient: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
            privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.GOOGLE_SERVICE_PRIVATE_KEY) : process.env.GOOGLE_SERVICE_PRIVATE_KEY,
            accessToken: token.access_token,
            expires: token.expiry_date,
          }
        });
        // verify connection configuration
        await transporter.verify(function(error, success) {
          if (error) {
            console.log(error);
          } else {
            console.log('Server is ready to take our messages');
          }
        });
        const userEmail = 'johnny.chen54@gmail.com';
        const firstName = 'Johnny';
        const deliveryAddress = '1046 Corvette Dr., San Jose, CA 95129';
        const dormPackagesOrdered = 0;
        const cookingPackagesOrdered = 1;
        const userWantsDelivery = false;
        const emailReceiptInfo = {
          firstName,
          dormPackagesOrdered,
          cookingPackagesOrdered,
          userWantsDelivery,
          deliveryAddress,
        };
        const message = {
          from: 'support@collectivefoods.com',
          to: userEmail,
          subject: 'Your Collective Order Confirmation and Receipt',
          // text: emailBody,
          // html: `<Grid columns={1}>` +
          //         `<Grid.Row stretched>` +
          //         `</Grid.Row>` +
          //         `<Grid.Row stretched>` +
          //         `</Grid.Row>` +
          //         `<Grid.Row stretched>` +
          //         `</Grid.Row>` +
          //       `</Grid>`,
          html: EmailReceipt(emailReceiptInfo),
          attachments: [{
            path: qrFile,
          }],
        };
        // await transporter.sendMail(message);
      });
    } catch (err) {
      console.log(err);
    }
  };

  await initializeFirstGroup();
  await updateCurrentDropoffID();
  // await updateCurrentVotingDropoffID();
  await initializeFirstDropoff();
  await initializeFirstDropFoodItemsBallots();
  await initializeSecondDropoff();
  await initializeSecondDropFoodItemsBallots();
  await initializeThirdDropoff();
  await initializeThirdDropFoodItemsBallots();
  await initializeRestrictedAddresses();
  await sendNightlyCSVupdates();
  await sendVotingReminderCSVupdates();
  await testConfirmationEmail();
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
      req.body.uid = uid;
      const restrictionType = 'university dorm';
      const userSignedUp = await userUtil.saveSubmittedUserInfo(req.body, restrictionType);
      await res.json({ userSignedUp });
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
      req.body.dropoffID = 3;
      const ballotsAndVotes = await ballotUtil.getBallotUserVotes(req.body);
      const userTransactionHistory = await transactionUtil.getUserTransactionHistory(uid);
      const deliveriesOrderedCount = await dropoffUtil.findDeliveriesOrderedCount(req.body.dropoffID);
      const availableDeliveriesLeft = 50 - deliveriesOrderedCount;
      const deliveryEligibilityObj = await userUtil.checkIfUserEligibleForDelivery(req.body.uid);
      const responseObject = {
        ballotsAndVotes,
        userTransactionHistory,
        availableDeliveriesLeft,
        deliveryEligibilityObj,
      };
      await res.json(responseObject);
    },
  },
  updateVotes: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: Implement dynamic dropoffID
      req.body.dropoffID = 3;
      // invoke vote util function that takes in the request body as an argument
      await voteUtil.updateVotes(req.body);
      res.json({ votesSaved: true });
    },
  },
  savePaymentVotes: {
    async post(req, res) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
        let uid = decodedToken.uid;
        req.body.uid = uid;
        // TODO: dynamic dropoffID
        const dropoffID = 3;
        // declare variable called errorMessage
        let errorMessage = '';
        const deliveriesOrderedCount = await dropoffUtil.findDeliveriesOrderedCount(dropoffID);
        // TODO: dynamic delivery limit
        // declare variable to keep track of avaiable deliveries left
        const availableDeliveriesLeft = 50 - deliveriesOrderedCount;
        const deliveryEligibilityObj = await userUtil.checkIfUserEligibleForDelivery(req.body.uid);
        if (req.body.userWantsDelivery && !deliveryEligibilityObj.isUserEligibleForDelivery) {
          if (deliveryEligibilityObj.isAddressDorm) {
            errorMessage = 'It looks like your address is a dorm address. Our pickup location is not far away.';
          }
          if (deliveryEligibilityObj.isAddressBeyondDeliveryReach) {
            errorMessage = 'It looks like your address is beyond our 5 mile delivery boundaries. We will try our best to extend our delivery boundaries in our next bulk buy. Thank you for your patience.';
          }
          res.json({ errorMessage, availableDeliveriesLeft });
        }
        // if user wants delivery and cooking packages ordered is greater than 0
        if (req.body.userWantsDelivery && req.body.cookingPackagesOrdered > 0) {
          // if available deliveries left is equal to 0
          if (availableDeliveriesLeft === 0) {
            // assign error message that tells client there are no more available deliveries
            errorMessage = 'There are no more available deliveries left for this round of bulk buy. We apologize for any inconvenience. We promise we\'ll be back with more deliveries in the future.';
            // respond back with the error message and avaiable deliveries left
            res.json({ errorMessage, availableDeliveriesLeft });
          }
        }

        // if user wants delivery and cooking packages ordered is 0
        if (req.body.userWantsDelivery && req.body.cookingPackagesOrdered === 0) {
          errorMessage = 'You would need to purchase at least 1 cooking package for delivery';
          res.json({ errorMessage, availableDeliveriesLeft });
        }

        const dormPackagesTotalDollarAmount = req.body.dormPackagesOrdered * 6;
        const cookingPackagesTotalDollarAmount = req.body.cookingPackagesOrdered * 11;
        req.body.cookingPackagesTotalDollarAmount = cookingPackagesTotalDollarAmount;
        req.body.deliveryFee = req.body.userWantsDelivery ? 3 : 0;
        const totalDollarAmount = dormPackagesTotalDollarAmount + cookingPackagesTotalDollarAmount + req.body.deliveryFee;
        req.body.totalDollarAmount = totalDollarAmount;
        const dormPackageEmailDescription = req.body.dormPackagesOrdered > 0 ? `${req.body.dormPackagesOrdered} x Dorm Package${req.body.dormPackagesOrdered < 2 ? '' : 's'} $${dormPackagesTotalDollarAmount}` : '';
        const cookingPackageEmailDescription = req.body.cookingPackagesOrdered > 0 ? `${req.body.cookingPackagesOrdered} x Cooking Package${req.body.cookingPackagesOrdered < 2 ? '' : 's'} $${cookingPackagesTotalDollarAmount}` : '';
        const deliveryAddress = await userUtil.findFormattedAddress(req.body.uid);
        const deliveryEmailDescription = req.body.userWantsDelivery ? `Delivery $${req.body.deliveryFee}\n\nDelivery Address:\n${deliveryAddress}\n(Dropoff at door to apartment/house)` : '';
        const packageConditionalNextLine = req.body.dormPackagesOrdered > 0 && req.body.cookingPackagesOrdered > 0 ? '\n' : '';
        const deliveryConditionalNextLine = req.body.userWantsDelivery && req.body.cookingPackagesOrdered > 0 ? '\n' : '';
        const description = `${dormPackageEmailDescription}${packageConditionalNextLine}${cookingPackageEmailDescription}${deliveryConditionalNextLine}${deliveryEmailDescription}`;
        await stripe.charges.create({
          amount: Math.round(totalDollarAmount * 100),
          currency: 'usd',
          card: req.body.token.id,
          description,
          receipt_email: req.body.email, // will only send in production, must go to dashboard to send test receipts from test Payments
        }, async (err, charge) => {
          if (err) {
            res.json({
              errorMessage: err.message,
            });
          } else {
            await transactionUtil.savePaymentInfo(req.body, dropoffID);
            // invoke vote util function that takes in the request body as an argument
            await voteUtil.saveVotes(req.body, dropoffID);
            await res.json({
              paymentCompleted: true,
              emailSentTo: req.body.email,
              errorMessage,
            });
            // const qrFile = __dirname + `/../adminData/qr.png`;
            // const userInfoForPickup = await transactionUtil.getUserInfoForPickup(dropoffID, req.body.uid);
            // await QRCode.toFile(qrFile, JSON.stringify(userInfoForPickup), (err) => {
            //   console.log(err);
            // });
            // const supportEmail = 'support@collectivefoods.com';
            // const jwtClient = await new google.auth.JWT(
            //   process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            //   null,
            //   process.env.NODE_ENV === 'production' ? JSON.parse(process.env.GOOGLE_SERVICE_PRIVATE_KEY) : process.env.GOOGLE_SERVICE_PRIVATE_KEY,
            //   ['https://mail.google.com/'], // an array of auth scopes
            //   supportEmail
            // );
            // await jwtClient.authorize(async (err, token) => {
            //   if (err) {
            //     console.log(err);
            //     return;
            //   }
            //   console.log('\n\ntoken: ', token);
            //   const emailReceiptInfo = await transactionUtil.findEmailReceiptInfo(dropoffID, req.body.uid);
            //   const emailBody = `Hi ${emailReceiptInfo.firstName},\n\nThe bulk buy is happening on ${emailReceiptInfo.intendedShipDate} from ${emailReceiptInfo.intendedPickupTimeStart} to ${emailReceiptInfo.intendedPickupTimeEnd}\n\nYour orders:\n${description}`;
            //
            //   const transporter = await nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 465,
            //     secure: true,
            //     auth: {
            //       type: 'OAuth2',
            //       user: supportEmail,
            //       serviceClient: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
            //       privateKey: process.env.NODE_ENV === 'production' ? JSON.parse(process.env.GOOGLE_SERVICE_PRIVATE_KEY) : process.env.GOOGLE_SERVICE_PRIVATE_KEY,
            //       accessToken: token.access_token,
            //       expires: token.expiry_date,
            //     }
            //   });
            //   // verify connection configuration
            //   await transporter.verify((error, success) => {
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('Server is ready to take our messages');
            //     }
            //   });
            //   const message = {
            //     from: supportEmail,
            //     to: req.body.email,
            //     subject: 'Your Collective Order Confirmation and Receipt',
            //     text: emailBody,
            //     // html: `<Grid columns={1}>` +
            //     //         `<Grid.Row stretched>` +
            //     //         `</Grid.Row>` +
            //     //         `<Grid.Row stretched>` +
            //     //         `</Grid.Row>` +
            //     //         `<Grid.Row stretched>` +
            //     //         `</Grid.Row>` +
            //     //       `</Grid>`,
            //     attachments: [{
            //       path: qrFile,
            //     }],
            //   };
            //   await transporter.sendMail(message);
            // });
          }
        });
      } catch(err) {
        console.log(err);
      }
    },
  },
  checkTransaction: {
    async post(req, res) {
      const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseAccessToken);
      let uid = decodedToken.uid;
      req.body.uid = uid;
      // TODO: Implement dynamic dropoffID
      req.body.dropoffID = 3;
      const checkTransactionResult = await transactionUtil.checkTransaction(req.body);
      res.json(checkTransactionResult);
    },
  },
  checkOffUser: {
    async post(req, res) {
      await transactionUtil.recordUserPickup(req.body.transactionID);
      res.json({ userCheckedOff: true });
    },
  },
  voteNotification: {
    get(req, res) {
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
