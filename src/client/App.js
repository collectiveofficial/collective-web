import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import SignUp from './components/authentication/SignUp.js';
import About from './components/about/About.js';
import foodwiki from './components/foodwiki/foodwiki.js';
import community from './components/community/community.js';
import config from './config.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    firebase.initializeApp(config);
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
      </div>
    );
  }
}

export default App;
