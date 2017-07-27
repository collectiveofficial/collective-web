import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Payment.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import LoginForm from './LoginForm.js';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return(
      <div>
        <Header />
        <div>Pay up dude</div>
        <Link to="/howitworks"><input type="submit" value="Submit" className={s.submit}/></Link>
        <Footer />
      </div>
    )
  }
}

export default Payment;
