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
import { nativeLogout } from './utils/auth.js';
import { ref, firebaseAuth } from './config';
// Component imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import RegisterForm from './components/authentication/RegisterForm.js';
import SignUp from './components/authentication/SignUp.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import feedback from './components/feedback/feedback.js';
import community from './components/community/community.js';
import about from './components/about/about.js';
import Voting from './components/home/Voting.js';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import Terms from './components/legal/collectiveterms.js';
import BFFTerms from './components/legal/BFFterms.js';
import Privacy from './components/legal/privacypolicy.js';
import OrderInfo from './components/orderInfo/OrderInfo.js';
import AdminDashboardContainer from './components/admin/AdminDashboardContainer.js';

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
    this.showUser = this.showUser.bind(this);
    this.handleFacebookAuth = this.handleFacebookAuth.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);
  }

  componentWillMount() {
    this.firebaseListener = firebaseAuth().onAuthStateChanged(async (user) => {
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

  componentWillUnmount() {
    this.firebaseListener();
  }

  async logOut() {
    await nativeLogout();
    this.props.logOut();
    this.props.setAuthorizeAdmin(false);
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async showUser() {
    console.log(this.props);
    await console.log(await firebaseAuth().currentUser);
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
        firstName: this.props.facebookData.first_name,
        lastName: this.props.facebookData.last_name,
        email: this.props.facebookData.email,
        pictureUrl: this.props.facebookData.picture.data.url,
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
        firebaseAccessToken: this.props.firebaseAccessToken,
      }),
    });
    const initialDataLoadResults = await initialDataLoad.json();
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
          <div>
            <Header logOut={this.logOut} showUser={this.showUser} />
            <Switch>
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path='/' exact component={() =>
                (<SignUp
                  handleFacebookAuth={this.handleFacebookAuth}
                  authorizeUser={this.authorizeUser}
                />)}
              />
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path="/login" component={() =>
                (<LogIn
                  nativeLogin={this.nativeLogin}
                  handleFacebookAuth={this.handleFacebookAuth}
                  authorizeUser={this.authorizeUser}
                />)}
              />
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path="/signup" component={() =>
                (<SignUp
                  handleFacebookAuth={this.handleFacebookAuth}
                  authorizeUser={this.authorizeUser}
                />)}
              />
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path="/register-form" component={() =>
                (<RegisterForm
                  authenticated={this.authenticated}
                  authorizeUser={this.authorizeUser}
                />)}
              />
              <PrivateRoute userAuthorized={this.props.userAuthorized} path="/home" component={Home} />
              <PrivateRoute userAuthorized={this.props.userAuthorized} path="/voting" component={Voting}/>
              <PrivateRoute userAuthorized={this.props.userAuthorized} path="/order-info" component={OrderInfo} />
              <AdminRoute userAuthorized={this.props.userAuthorized} adminAuthorized={this.props.adminReducers.adminAuthorized} path="/admin-dashboard" component={AdminDashboardContainer} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/foodwiki" component={foodwiki} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/community" component={community} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/terms" component={Terms} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/bff" component={BFFTerms} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/privacy" component={Privacy} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/about" component={about} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/foodwiki" component={foodwiki} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/community" component={community} />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/feedback" component={feedback} />
              <PublicRoute render={() => <h3>No Match</h3>} />
            </Switch>
            <Footer />
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
