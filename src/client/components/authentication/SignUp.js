import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
  }

  async handleFBSignUp() {
    const provider = await new firebase.auth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebase.auth().signInWithPopup(provider);
    const token = result.credential.accessToken;
    // const user = result.user;
    // await this.setState({ email: user.email });
    // await this.setState({ photoURL: user.photoURL });
    const response = await fetch('/auth/facebook', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        facebook_token: token,
      }),
    });
    const responseData = await response.json();
    await console.log(responseData);
    await this.setState({ facebookData: responseData.facebook_payload }, () => {
      console.log('this.state.facebookData: ', this.state.facebookData);
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className={s.root}>
          <div className={s.container}>
            <h1>Register</h1>
            <RegisterForm />
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.handleFBSignUp}
            >
              Sign up with Facebook
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default SignUp;
