// React imports
import React from 'react';

import {
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import initReactFastclick from 'react-fastclick';
// Firebase imports
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { nativeLogout } from './utils/auth.js';
import { ref, firebaseAuth } from './config';
// Component imports
import HomeContainer from './components/home/containers/HomeContainer.js';
import LoginContainer from './components/authentication/containers/LoginContainer.js';
import RegisterFormContainer from './components/authentication/containers/RegisterFormContainer.js';
import SignUpContainer from './components/authentication/containers/SignUpContainer.js';
import FoodWiki from './components/foodwiki/FoodWiki.js';
import Feedback from './components/feedback/Feedback.js';
import Community from './components/community/Community.js';
import About from './components/about/About.js';
import Faq from './components/about/Faq.js';
import VotingContainer from './components/voting/containers/VotingContainer.js';
import PaymentContainer from './components/payment/containers/PaymentContainer.js';
import HeaderContainer from './components/header/containers/HeaderContainer.js';
import Footer from './components/footer/Footer.js';
import CollectiveTerms from './components/legal/CollectiveTerms.js';
import BffTerms from './components/legal/BffTerms.js';
import PrivacyPolicy from './components/legal/PrivacyPolicy.js';
import OrderInfo from './components/orderInfo/OrderInfo.js';
import AdminDashboardContainer from './components/admin/containers/AdminDashboardContainer.js';
import LandingContainer from './components/landing/containers/LandingContainer.js';
import ContactContainer from './components/contact/containers/ContactContainer.js';
import styles from './App.css';

initReactFastclick();

const PrivateRoute = ({ component: Component, userAuthorized, ...rest }) => { // TODO MOVE
  return (
    <Route
      {...rest}
      render={(props) => userAuthorized === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  );
};

const PublicRoute = ({ component: Component, userAuthorized, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  );
};

const DenyAuthorizedRoute = ({ component: Component, userAuthorized, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => userAuthorized === true
        ? <Redirect to='/home' />
        : <Component {...props} />}
    />
  );
};

const AdminRoute = ({ component: Component, userAuthorized, adminAuthorized, ...rest }) => { // TODO MOVE
  return (
    <Route
      {...rest}
      render={(props) => userAuthorized === true && adminAuthorized === true
        ? <Component {...props} />
        : <Redirect to='/home' />}
    />
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.handleFacebookAuth = this.handleFacebookAuth.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);
    this.firebaseListener = this.firebaseListener.bind(this);
  }

  componentWillMount() {
    this.firebaseListener();
  }

  componentWillUnmount() {
    this.firebaseListener();
  }

  async firebaseListener() {
    await firebaseAuth().onAuthStateChanged(async (user) => {
      if (user) { // is signed in
        await console.log('Logged in');
        const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
        await this.props.setFirebaseAccessToken(firebaseAccessToken);
        const response = await fetch('/auth/check', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            firebaseAccessToken,
          }),
        })
        const responseData = await response.json();
        const userAuthorized = responseData.userAuthorized;
        const isUserAdmin = responseData.isUserAdmin;
        if (userAuthorized && isUserAdmin) {
          await this.authorizeUser();
          await this.props.setAuthorizeAdmin(true);
        } else if (userAuthorized) {
          await this.authorizeUser();
        }
        await this.props.setUserAuthenticated(true);
        await this.props.setLoading(false);
      } else { // isn't signed in
        await this.props.setUserAuthenticated(false);
        await this.props.setLoading(false);
        await this.props.setUserAuthorized(false);
      }
    });
  }

  async logOut() {
    await nativeLogout();
    this.props.logOut();
    this.props.setAuthorizeAdmin(false);
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async handleFacebookAuth() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    // const firebaseAccessToken = result.user.ie;
    const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
    // await this.setState({ firebaseAccessToken });
    this.props.setFirebaseAccessToken(firebaseAccessToken);
    const token = result.credential.accessToken;
    const response = await fetch('/auth/facebook', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        facebook_token: token,
      }),
    });
    const responseData = await response.json();
    this.props.setFacebookData(responseData.facebook_payload);
    const facebookCheckResponse = await fetch('/auth/facebook/check', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken,
        firstName: this.props.appReducers.facebookData.first_name,
        lastName: this.props.appReducers.facebookData.last_name,
        email: this.props.appReducers.facebookData.email,
        pictureUrl: this.props.appReducers.facebookData.picture.data.url,
      }),
    });
    const facebookCheckResponseData = await facebookCheckResponse.json();
    const userAlreadyExists = facebookCheckResponseData.userAlreadyExists;
    const hasUserFinishedSignUp = facebookCheckResponseData.hasUserFinishedSignUp;
    const saveUserOnFacebookSignUpExecuted = facebookCheckResponseData.saveUserOnFacebookSignUpExecuted;
    if (userAlreadyExists && hasUserFinishedSignUp) {
      await this.authorizeUser();
    } else if ((userAlreadyExists && !hasUserFinishedSignUp)) {
      this.props.setRouteToRegisterForm(true);
    } else if (saveUserOnFacebookSignUpExecuted) {
      const currentFirebaseUser = await firebaseAuth().currentUser;
      const sendEmailVerification = await currentFirebaseUser.sendEmailVerification();
      this.props.setRouteToRegisterForm(true);
    }
  }

  async authorizeUser() {
    this.props.setUserAuthorized(true);
    // TODO: Change hardcoded dropoff to dynamic
    const initialDataLoad = await fetch('/vote-ballot/get-ballot-votes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken: this.props.appReducers.firebaseAccessToken,
      }),
    });
    const initialDataLoadResults = await initialDataLoad.json();
    await this.props.setCurrentFutureDropoffs(initialDataLoadResults.currentFutureDropoffs);
    await this.props.setBallotsAndVotes(initialDataLoadResults.ballotsAndVotes);
    await this.props.setUserTransactionHistory(initialDataLoadResults.userTransactionHistory);
    await this.props.setAvailableDeliveriesLeft(initialDataLoadResults.availableDeliveriesLeft);
    await this.props.setDeliveryEligibilityObj(initialDataLoadResults.deliveryEligibilityObj);
    if (initialDataLoadResults.isUserAdmin) {
      await this.props.setAdminData(initialDataLoadResults.adminData);
      await this.props.setAdminFoodItems(initialDataLoadResults.adminFoodItems);
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className={styles.Site}>
          <HeaderContainer />
          <Switch className={styles.SiteContent}>
            <DenyAuthorizedRoute userAuthorized={this.props.appReducers.userAuthorized} path='/' exact component={() =>
              (<LandingContainer />)}
            />
            <DenyAuthorizedRoute userAuthorized={this.props.appReducers.userAuthorized} path="/login" component={() =>
              (<LoginContainer
                handleFacebookAuth={this.handleFacebookAuth}
                authorizeUser={this.authorizeUser}
              />)}
            />
            <DenyAuthorizedRoute userAuthorized={this.props.appReducers.userAuthorized} path="/signup" component={() =>
              (<SignUpContainer
                handleFacebookAuth={this.handleFacebookAuth}
                authorizeUser={this.authorizeUser}
              />)}
            />
            <DenyAuthorizedRoute userAuthorized={this.props.appReducers.userAuthorized} path="/register-form" component={() =>
              (<RegisterFormContainer
                authorizeUser={this.authorizeUser}
              />)}
            />
            <PrivateRoute userAuthorized={this.props.appReducers.userAuthorized} path="/home" component={HomeContainer} />
            <PrivateRoute userAuthorized={this.props.appReducers.userAuthorized} path="/voting" component={VotingContainer}/>
            <PrivateRoute userAuthorized={this.props.appReducers.userAuthorized} path="/payment" component={PaymentContainer}/>
            <PrivateRoute userAuthorized={this.props.appReducers.userAuthorized} path="/order-info" component={OrderInfo} />
            <AdminRoute userAuthorized={this.props.appReducers.userAuthorized} adminAuthorized={this.props.adminReducers.adminAuthorized} path="/admin-dashboard" component={AdminDashboardContainer} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/foodwiki" component={FoodWiki} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/community" component={Community} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/terms" component={CollectiveTerms} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/bff" component={BffTerms} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/privacy" component={PrivacyPolicy} />
            {/* <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/about" component={About} /> */}
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/faq" component={Faq} />
            <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/feedback" component={Feedback} />
            {/* <PublicRoute userAuthorized={this.props.appReducers.userAuthorized} path="/contact" component={ContactContainer} /> */}
            <PublicRoute render={() => <h3>No Match</h3>} />
          </Switch>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
