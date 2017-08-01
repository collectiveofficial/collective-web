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
import Howitworks from './components/authentication/Howitworks.js';
import Payment from './components/authentication/Payment.js';
import About from './components/about/About.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import community from './components/community/community.js';
import { ref, firebaseAuth } from './config';
import Voting from './components/home/Voting.js';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';
import { nativeLogout } from './utils/auth.js';

initReactFastclick();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      loading: true,
      homePath: '/home',
      signupPath: '/',
    };
    this.logOut = this.logOut.bind(this);
    // this.logIn = this.logIn.bind(this);
  }

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) { // is signed in
        console.log('Logged in');
        this.setState({
          authed: true,
          // need another state to check authorization for dynamic routing
          loading: false,
          homePath: '/',
          signupPath: '/signup',
        });
      } else { // isn't signed in
        this.setState({
          authed: false,
          loading: false,
          homePath: '/home',
          signupPath: '/',
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  async logOut() {
    await nativeLogout();
  }

  // async logIn() {
  //   await console.log('Logged in');
  //   await this.setState({
  //     authed: true,
  //     loading: false,
  //     homePath: '/',
  //     signupPath: '/signup',
  //   });
  // }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header authed={this.state.authed} logOut={this.logOut} />
          <Route path="/login" component={() => <LogIn authed={this.authed} />} />
          <Route path={this.state.homePath} component={Home} />
          <Route path="/about" component={About} />
          <Route path="/foodwiki" component={foodwiki} />
          <Route path="/howitworks" component={Howitworks} />
          <Route path="/payment" component={Payment} />
          <Route path="/community" component={community} />
          <Route path="/voting" component={Voting} />
          <Route exact path={this.state.signupPath} component={SignUp} />
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
