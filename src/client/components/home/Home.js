import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Header />
        <h2>Upcoming Bulk Buys</h2>
        <Footer />
      </div>
    );
  }
}

export default Home;
