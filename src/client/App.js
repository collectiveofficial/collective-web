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
      unmounted: false,
    };
    this.logOut = this.logOut.bind(this);
    this.showUser = this.showUser.bind(this);
    this.nativeLogin = this.nativeLogin.bind(this);
  }

  componentDidMount() {
    this.firebaseListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) { // is signed in
        console.log('Logged in');
        this.setState({
          authenticated: true,
          // need another state to check authorization for dynamic routing
          loading: false,
          // homePath: '/',
          // signupPath: '/signup',
        }, () => {
          console.log('this.state.loading: ', this.state.loading);
        });
      } else { // isn't signed in
      this.setState({
        authenticated: false,
        loading: false,
        // homePath: '/home',
        // signupPath: '/',
      }, () => {
        console.log('this.state.loading: ', this.state.loading);
      });
    }
  });

  }

  componentWillUnmount() {
    this.firebaseListener();
    this.setState({ unmounted: true });
  }

  async logOut() {
    await nativeLogout();
    await console.log('User after log out', firebaseAuth().currentUser);
  }

  async showUser() {
    await console.log(await firebaseAuth().currentUser);
  }

  async nativeLogin(email, password) {
    const user = await firebaseAuth().signInWithEmailAndPassword(email, password);
    await this.setState({ firebaseAccessToken: user.ie });
    await console.log(this.state.firebaseAccessToken);
    await this.setState({ userWantsEmailSignup: true });
    await console.log('this.state.userWantsEmailSignup', this.state.userWantsEmailSignup);
    return user;
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header authenticated={this.state.authenticated} logOut={this.logOut} showUser={this.showUser}/>
          <Route path="/login" component={() => <LogIn authenticated={this.authenticated} nativeLogin={this.nativeLogin} unmounted={this.state.unmounted} />} />
          <Route path={this.state.homePath} component={Home} />
          <Route path="/foodwiki" component={foodwiki} />
          <Route path="/terms" component={Terms} />
          <Route path="/bff" component={BFFTerms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/community" component={community} />
          <Route path="/voting" component={Voting} />
          <Route path="/register-form" component={() => <RegisterForm authenticated={this.authenticated} firebaseAccessToken={this.state.firebaseAccessToken} userWantsEmailSignup={this.state.userWantsEmailSignup} />} />
          <Route exact path={this.state.signupPath} component={SignUp} />
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
