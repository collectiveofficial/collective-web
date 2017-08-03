import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Payment.css';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return(
      <div>
        <div>Pay up dude</div>
        <Link to="/howitworks"><input type="submit" value="Submit" className={s.submit}/></Link>
      </div>
    )
  }
}

export default Payment;
