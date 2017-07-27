import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Howitworks.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import LoginForm from './LoginForm.js';

class Howitworks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return(
      <div>
        <Header />
        <div>How it works dude</div>
        <Link to="/"><input type="submit" value="Let's get started!" className={s.submit}/></Link>
        <Footer />
      </div>
    )
  }
}



export default Howitworks
