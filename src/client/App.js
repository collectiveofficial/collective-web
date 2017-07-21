import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Home from './components/home/Home.js';
import LogIn from './components/authentication/LogIn.js';
import SignUp from './components/authentication/SignUp.js';
import About from './components/about/About.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/about" component={About} />
      </div>
    );
  }
}

export default App;
