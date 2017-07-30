import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import SignUp from './components/authentication/SignUp.js';
import Howitworks from './components/authentication/Howitworks.js';
import Payment from './components/authentication/Payment.js';
import About from './components/about/About.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import community from './components/community/community.js';
import { ref, firebaseAuth } from './config';
import Voting from './components/home/Voting.js';

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
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/about" component={About} />
        <Route path="/foodwiki" component={foodwiki} />
        <Route path="/community" component={community} />
        <Route path="/voting" component={Voting} />
        <Route path="/howitworks" component={Howitworks} />
        <Route path="/payment" component={Payment} />
      </div>
    );
  }
}

export default App;
