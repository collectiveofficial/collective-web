import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import initReactFastclick from 'react-fastclick';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import RegisterForm from './components/authentication/RegisterForm.js';
import SignUp from './components/authentication/SignUp.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import community from './components/community/community.js';
import { ref, firebaseAuth } from './config';
import Voting from './components/home/Voting.js';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import { nativeLogout } from './utils/auth.js';
import Terms from './components/legal/collectiveterms.js';
import BFFTerms from './components/legal/BFFterms.js';
import Privacy from './components/legal/privacypolicy.js';

initReactFastclick();

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
    };
    this.logOut = this.logOut.bind(this);
    this.showUser = this.showUser.bind(this);
    this.handleFacebookAuth = this.handleFacebookAuth.bind(this);
  }

  componentDidMount() {
    this.firebaseListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) { // is signed in
        console.log('Logged in');
        console.log('user firebaseAccessToken in App.js componentDidMount: ', user.ie);
        fetch('/auth/check', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            firebaseAccessToken: user.ie,
          }),
        })
        .then((responseData) => {
          const userAuthorized = responseData.userAuthorized;
          if (userAuthorized) {
            this.setState({ userAuthorized });
          }
          if (this.state.userAuthorized) {
            this.setState({ homePath: '/' });
            this.setState({ signupPath: '/signup' });
          } else {
            this.setState({ homePath: '/home' });
            this.setState({ signupPath: '/' });
          }

        });
        this.setState({
          authenticated: true,
          loading: false,
        }, () => {
          console.log('this.state.loading: ', this.state.loading);
        });
      } else { // isn't signed in
        this.setState({
          authenticated: false,
          loading: false,
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
    await this.setState({ userAuthorized: false });
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async showUser() {
    await console.log(await firebaseAuth().currentUser);
  }

  async handleFacebookAuth() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    await console.log('inside handleFacebookAuth');
    await console.log('firebaseAuth result: ', result);
    const firebaseAccessToken = result.user.ie;
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
    // const idToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
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
      await this.setState({ userAuthorized: true });
    } else if ((userAlreadyExists && !hasUserFinishedSignUp) || saveUserOnFacebookSignUpExecuted) {
      await this.setState({ routeToRegisterForm: true });
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header authenticated={this.state.authenticated} logOut={this.logOut} showUser={this.showUser}/>
          <Route path="/login" component={() =>
            (<LogIn
              nativeLogin={this.nativeLogin}
              handleFacebookAuth={this.handleFacebookAuth}
              facebookData={this.state.facebookData}
              firebaseAccessToken={this.state.firebaseAccessToken}
              routeToRegisterForm={this.state.routeToRegisterForm}
              userAuthorized={this.state.userAuthorized}
            />)}
          />
          <Route path={this.state.homePath} component={Home} />
          <Route path="/foodwiki" component={foodwiki} />
          <Route path="/terms" component={Terms} />
          <Route path="/bff" component={BFFTerms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/community" component={community} />
          <Route path="/voting" component={Voting} />
          <Route path="/register-form" component={() => <RegisterForm authenticated={this.authenticated} firebaseAccessToken={this.state.firebaseAccessToken} userWantsEmailSignup={this.state.userWantsEmailSignup} />} />
          <Route exact path={this.state.signupPath} component={() =>
            (<SignUp
              handleFacebookAuth={this.handleFacebookAuth}
              facebookData={this.state.facebookData}
              firebaseAccessToken={this.state.firebaseAccessToken}
              routeToRegisterForm={this.state.routeToRegisterForm}
              userAuthorized={this.state.userAuthorized}
            />)}
          />
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
