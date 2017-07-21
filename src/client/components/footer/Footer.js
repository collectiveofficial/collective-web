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
        <h3>Collective Foods</h3>
      </div>
    );
  }
}

export default Header;
