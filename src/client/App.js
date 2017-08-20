import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import initReactFastclick from 'react-fastclick';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import RegisterForm from './components/authentication/RegisterForm.js';
import SignUp from './components/authentication/SignUp.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import feedback from './components/feedback/feedback.js';
import community from './components/community/community.js';
import about from './components/about/about.js';
import { ref, firebaseAuth } from './config';
import Voting from './components/home/Voting.js';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import { nativeLogout } from './utils/auth.js';
import Terms from './components/legal/collectiveterms.js';
import BFFTerms from './components/legal/BFFterms.js';
import Privacy from './components/legal/privacypolicy.js';
import Settings from './components/settings/Settings.js';

initReactFastclick();
// if ('ontouchstart' in document.documentElement) {
//   document.body.style.cursor = 'pointer';
// }

const PrivateRoute = ({component: Component, userAuthorized, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => userAuthorized === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  );
};

const PublicRoute = ({component: Component, userAuthorized, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => <Component {...props} />}
    />
  );
};

const DenyAuthorizedRoute = ({component: Component, userAuthorized, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => userAuthorized === false
        ? <Component {...props} />
        : <Redirect to='/home' />}
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true,
      homePath: '/home',
      signupPath: '/',
      userWantsEmailSignup: '',
      firebaseAccessToken: '',
      routeToRegisterForm: false,
      userAuthorized: false,
      ballotsAndVotes: '',
      userTransactionHistory: '',
    };
    this.logOut = this.logOut.bind(this);
    this.showUser = this.showUser.bind(this);
    this.handleFacebookAuth = this.handleFacebookAuth.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);
    this.setRouteToRegisterFormState = this.setRouteToRegisterFormState.bind(this);
    this.setUserWantsEmailSignupState = this.setUserWantsEmailSignupState.bind(this);
    this.setFirebaseAccessTokenState = this.setFirebaseAccessTokenState.bind(this);
    this.updateBallotsAndVotes = this.updateBallotsAndVotes.bind(this);
  }

  componentDidMount() {
    this.firebaseListener = firebaseAuth().onAuthStateChanged(async (user) => {
      if (user) { // is signed in
        await console.log('Logged in');
        const firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
        await this.setState({ firebaseAccessToken });
        // await console.log('user firebaseAccessToken in App.js componentDidMount: ', user.ie);
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
        console.log('userAuthorized: ', userAuthorized)
        if (userAuthorized) {
          this.authorizeUser();
        }

        await this.setState({
          authenticated: true,
          loading: false,
        }, () => {
          console.log('this.state.loading: ', this.state.loading);
        });
      } else { // isn't signed in
        await this.setState({
          authenticated: false,
          loading: false,
          userAuthorized: false,
        }, () => {
          console.log('this.state.loading: ', this.state.loading);
        });
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener();
  }

  async logOut() {
    await nativeLogout();
    await this.setState({ routeToRegisterForm: false });
    // await this.setState({ userAuthorized: false });
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async showUser() {
    await console.log(await firebaseAuth().currentUser);
  }

  async setRouteToRegisterFormState(boolean) {
    this.setState({ routeToRegisterForm: boolean });
  }

  async setUserWantsEmailSignupState(boolean) {
    this.setState({ userWantsEmailSignup: boolean });
  }

  async setFirebaseAccessTokenState(accessToken) {
    this.setState({ firebaseAccessToken: accessToken });
  }

  async handleFacebookAuth() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    await console.log('inside handleFacebookAuth');
    await console.log('firebaseAuth result: ', result);
    // const firebaseAccessToken = result.user.ie;
    const firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    await this.setState({ firebaseAccessToken });
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
    await this.setState({ facebookData: responseData.facebook_payload }, () => {
      console.log('this.state.facebookData: ', this.state.facebookData);
    });
    const facebookCheckResponse = await fetch('/auth/facebook/check', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken,
        firstName: this.state.facebookData.first_name,
        lastName: this.state.facebookData.last_name,
        email: this.state.facebookData.email,
        pictureUrl: this.state.facebookData.picture.data.url,
      }),
    });
    const facebookCheckResponseData = await facebookCheckResponse.json();
    console.log('responseData: ', facebookCheckResponseData);
    const userAlreadyExists = facebookCheckResponseData.userAlreadyExists;
    const hasUserFinishedSignUp = facebookCheckResponseData.hasUserFinishedSignUp;
    const saveUserOnFacebookSignUpExecuted = facebookCheckResponseData.saveUserOnFacebookSignUpExecuted;
    if (userAlreadyExists && hasUserFinishedSignUp) {
      console.log('authorize user');
      await this.authorizeUser();
    } else if ((userAlreadyExists && !hasUserFinishedSignUp)) {
      await this.setRouteToRegisterFormState(true);
    } else if (saveUserOnFacebookSignUpExecuted) {
      const currentFirebaseUser = await firebaseAuth().currentUser;
      const sendEmailVerification = await currentFirebaseUser.sendEmailVerification();
      await console.log('sendEmailVerification successful.');
      await this.setRouteToRegisterFormState(true);
    }
  }

  async authorizeUser() {
    await this.setState({ userAuthorized: true });
    // TODO: Change hardcoded dropoff to dynamic
    const initialDataLoad = await fetch('/vote-ballot/get-ballot-votes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken: this.state.firebaseAccessToken,
      }),
    })
    const initialDataLoadResults = await initialDataLoad.json();
    this.setState({ ballotsAndVotes: initialDataLoadResults.ballotsAndVotes });
    this.setState({ userTransactionHistory: initialDataLoadResults.userTransactionHistory });
    // console.log('-------> initialDataLoadResults.userTransactionHistory: ', initialDataLoadResults.userTransactionHistory);
    console.log('-------> this.state.ballotsAndVotes: ', this.state.ballotsAndVotes);
    console.log('-------> this.state.userTransactionHistory: ', this.state.userTransactionHistory);
  }

  updateBallotsAndVotes(newBallotsAndVotes) {
    this.setState({ ballotsAndVotes: newBallotsAndVotes });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header authenticated={this.state.authenticated} logOut={this.logOut} showUser={this.showUser} userAuthorized={this.state.userAuthorized} />
          <Switch>
            <DenyAuthorizedRoute userAuthorized={this.state.userAuthorized} path='/' exact component={() =>
              (<SignUp
                handleFacebookAuth={this.handleFacebookAuth}
                facebookData={this.state.facebookData}
                firebaseAccessToken={this.state.firebaseAccessToken}
                setFirebaseAccessTokenState={this.setFirebaseAccessTokenState}
                routeToRegisterForm={this.state.routeToRegisterForm}
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                setRouteToRegisterFormState={this.setRouteToRegisterFormState}
                setUserWantsEmailSignupState={this.setUserWantsEmailSignupState}
                userAuthorized={this.state.userAuthorized}
                authorizeUser={this.authorizeUser}
              />)}
            />
            <DenyAuthorizedRoute userAuthorized={this.state.userAuthorized} path="/login" component={() =>
              (<LogIn
                nativeLogin={this.nativeLogin}
                handleFacebookAuth={this.handleFacebookAuth}
                facebookData={this.state.facebookData}
                firebaseAccessToken={this.state.firebaseAccessToken}
                setFirebaseAccessTokenState={this.setFirebaseAccessTokenState}
                setRouteToRegisterFormState={this.setRouteToRegisterFormState}
                setUserWantsEmailSignupState={this.setUserWantsEmailSignupState}
                routeToRegisterForm={this.state.routeToRegisterForm}
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                userAuthorized={this.state.userAuthorized}
                authorizeUser={this.authorizeUser}
              />)}
            />
            <PrivateRoute userAuthorized={this.state.userAuthorized} path="/home" component={Home} />
            <PrivateRoute userAuthorized={this.state.userAuthorized} path="/voting" component={() =>
              (<Voting
                ballotsAndVotes={this.state.ballotsAndVotes}
                updateBallotsAndVotes={this.updateBallotsAndVotes}
                firebaseAccessToken={this.state.firebaseAccessToken}
              />)}
            />
            <PrivateRoute userAuthorized={this.state.userAuthorized} path="/settings" component={() =>
              (<Settings
                userTransactionHistory={this.state.userTransactionHistory}
              />)} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/foodwiki" component={foodwiki} />
            <DenyAuthorizedRoute userAuthorized={this.state.userAuthorized} path="/signup" component={() =>
              (<SignUp
                handleFacebookAuth={this.handleFacebookAuth}
                facebookData={this.state.facebookData}
                firebaseAccessToken={this.state.firebaseAccessToken}
                setFirebaseAccessTokenState={this.setFirebaseAccessTokenState}
                routeToRegisterForm={this.state.routeToRegisterForm}
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                setRouteToRegisterFormState={this.setRouteToRegisterFormState}
                setUserWantsEmailSignupState={this.setUserWantsEmailSignupState}
                userAuthorized={this.state.userAuthorized}
                authorizeUser={this.authorizeUser}
              />)}
            />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/community" component={community} />
            <DenyAuthorizedRoute userAuthorized={this.state.userAuthorized} path="/register-form" component={() =>
              (<RegisterForm
                authenticated={this.authenticated}
                firebaseAccessToken={this.state.firebaseAccessToken}
                authorizeUser={this.authorizeUser}
                userWantsEmailSignup={this.state.userWantsEmailSignup}
              />)}
            />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/terms" component={Terms} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/bff" component={BFFTerms} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/privacy" component={Privacy} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/about" component={about} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/foodwiki" component={foodwiki} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/community" component={community} />
            <PublicRoute userAuthorized={this.state.userAuthorized} path="/feedback" component={feedback} />
            <PublicRoute render={() => <h3>No Match</h3>} />
          </Switch>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
