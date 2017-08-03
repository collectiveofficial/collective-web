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
import Payment from './components/authentication/Payment.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import community from './components/community/community.js';
import { ref, firebaseAuth } from './config';
import Voting from './components/home/Voting.js';
import Header from './components/header/Header.js';
import Footer from './components/footer/Footer.js';

initReactFastclick();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      loading: true,
    };
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) { // is signed in
        console.log('Logged in')
        this.setState({
          authed: true,
          loading: false,
        })
      } else { // isn't signed in
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Header />
          <Route path="/login" component={LogIn} />
          <Route path="/home" component={Home} />
          <Route path="/foodwiki" component={foodwiki} />
          <Route path="/payment" component={Payment} />
          <Route path="/community" component={community} />
          <Route path="/voting" component={Voting} />
          <Route exact path="/" component={SignUp} />
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
