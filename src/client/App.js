// React imports
import React, { Component } from 'react';

import {
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import initReactFastclick from 'react-fastclick';
// Redux imports
import { connect } from 'react-redux';
// Redux actions impors
import * as appActionCreators from './action-creators/appActions';
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


initReactFastclick();
// if ('ontouchstart' in document.documentElement) {
//   document.body.style.cursor = 'pointer';
// }

const PrivateRoute = ({component: Component, userAuthorized, ...rest}) => { // TODO MOVE
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
      render={(props) => userAuthorized === true
        ? <Redirect to='/home' />
        : <Component {...props} />}
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
    this.showUser = this.showUser.bind(this);
    this.handleFacebookAuth = this.handleFacebookAuth.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);
    // this.setRouteToRegisterFormState = this.setRouteToRegisterFormState.bind(this);
    // this.setUserWantsEmailSignupState = this.setUserWantsEmailSignupState.bind(this);
    // this.setFirebaseAccessTokenState = this.setFirebaseAccessTokenState.bind(this);
    // this.updateBallotsAndVotes = this.updateBallotsAndVotes.bind(this);
  }

  componentDidMount() {
    this.firebaseListener = firebaseAuth().onAuthStateChanged(async (user) => {
      if (user) { // is signed in
        await console.log('Logged in');
        const firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
        this.props.dispatch(appActionCreators.setFirebaseAccessToken(firebaseAccessToken));
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

        // await this.setState({
        //   authenticated: true,
        //   loading: false,
        // }, () => {
        //   console.log('this.state.loading: ', this.state.loading);
        // });
      this.props.dispatch(appActionCreators.setUserAuthenticated(true));
      this.props.dispatch(appActionCreators.setLoading(false));

      } else { // isn't signed in
        // await this.setState({
        //   authenticated: false,
        //   loading: false,
        //   userAuthorized: false,
        // }, () => {
        //   console.log('this.state.loading: ', this.state.loading);
        // });
        this.props.dispatch(appActionCreators.setUserAuthenticated(false));
        this.props.dispatch(appActionCreators.setLoading(false));
        this.props.dispatch(appActionCreators.setUserAuthorized(false))
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener();
  }

  async logOut() {
    await nativeLogout();
    // await this.setState({ routeToRegisterForm: false });
    this.props.dispatch(appActionCreators.setRouteToRegisterForm(false))
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async showUser() {
    console.log(this.props);
    await console.log(await firebaseAuth().currentUser);
  }

  // async setRouteToRegisterFormState(boolean) {
  //   this.setState({ routeToRegisterForm: boolean });
  // }

  // async setUserWantsEmailSignupState(boolean) {
  //   this.setState({ userWantsEmailSignup: boolean });
  // }

  // async setFirebaseAccessTokenState(accessToken) {
  //   this.setState({ firebaseAccessToken: accessToken });
  // }

  async handleFacebookAuth() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    await console.log('inside handleFacebookAuth');
    await console.log('firebaseAuth result: ', result);
    // const firebaseAccessToken = result.user.ie;
    const firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    // await this.setState({ firebaseAccessToken });
    this.props.dispatch(appActionCreators.setFirebaseAccessToken(firebaseAccessToken));
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
    // await this.setState({ facebookData: responseData.facebook_payload }, () => {
    //   console.log('this.state.facebookData: ', this.state.facebookData);
    // });
    this.props.dispatch(appActionCreators.setFacebookData(responseData.facebook_payload));
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
    console.log('responseData: ', facebookCheckResponseData);
    const userAlreadyExists = facebookCheckResponseData.userAlreadyExists;
    const hasUserFinishedSignUp = facebookCheckResponseData.hasUserFinishedSignUp;
    const saveUserOnFacebookSignUpExecuted = facebookCheckResponseData.saveUserOnFacebookSignUpExecuted;
    if (userAlreadyExists && hasUserFinishedSignUp) {
      console.log('authorize user');
      await this.authorizeUser();
    } else if ((userAlreadyExists && !hasUserFinishedSignUp)) {
      // await this.setRouteToRegisterFormState(true);
      this.props.dispatch(appActionCreators.setRouteToRegisterForm(true));
    } else if (saveUserOnFacebookSignUpExecuted) {
      const currentFirebaseUser = await firebaseAuth().currentUser;
      const sendEmailVerification = await currentFirebaseUser.sendEmailVerification();
      await console.log('sendEmailVerification successful.');
      // await this.setRouteToRegisterFormState(true);
      this.props.dispatch(appActionCreators.setRouteToRegisterForm(true));
    }
  }

  async authorizeUser() {
    // await this.setState({ userAuthorized: true });
    this.props.dispatch(appActionCreators.setUserAuthorized(true));
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
    })
    const initialDataLoadResults = await initialDataLoad.json();
    // await this.setState({ ballotsAndVotes: initialDataLoadResults.ballotsAndVotes });
    this.props.dispatch(appActionCreators.setBallotsAndVotes(initialDataLoadResults.ballotsAndVotes));
    await console.log('-------> this.props.ballotsAndVotes: ', this.props.ballotsAndVotes);
  }

  // updateBallotsAndVotes(newBallotsAndVotes) {
  //   this.setState({ ballotsAndVotes: newBallotsAndVotes });
  // }

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
              <PrivateRoute userAuthorized={this.props.userAuthorized} path="/home" component={Home} />
              <PrivateRoute userAuthorized={this.props.userAuthorized} path="/voting" component={Voting}
              />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/foodwiki" component={foodwiki} />
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path="/signup" component={() =>
                (<SignUp
                  handleFacebookAuth={this.handleFacebookAuth}
                  authorizeUser={this.authorizeUser}
                />)}
              />
              <PublicRoute userAuthorized={this.props.userAuthorized} path="/community" component={community} />
              <DenyAuthorizedRoute userAuthorized={this.props.userAuthorized} path="/register-form" component={() =>
                (<RegisterForm
                  authenticated={this.authenticated}
                  authorizeUser={this.authorizeUser}
                />)}
              />
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

const mapStateToProps = (state, props) => {
  return {
    authenticated: state.appReducer._userAuthenticated, // TODO RENAME
    userAuthorized: state.appReducer._userAuthorized,
    ballotsAndVotes: state.appReducer._ballotsAndVotes,
    firebaseAccessToken: state.appReducer._firebaseAccessToken,
    loading: state.appReducer._loading,
    routeToRegisterForm: state.appReducer._routeToRegisterForm,
    userWantsEmailSignup: state.appReducer._userWantsEmailSignup,
    facebookData: state.appReducer._facebookData
  }
};

const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;
