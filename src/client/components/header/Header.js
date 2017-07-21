import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h1>Collective</h1>
        <Link to="/about">About</Link>
        <div> | </div>
        <Link to="/login">Log In</Link>
        <div>or</div>
        <Link to="/signup">Sign Up</Link>
      </div>
    );
  }
}

export default Header;
