import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import { ref, firebaseAuth } from '../../config'
import s from './Login.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      emailInput: '',
      passwordInput: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
        <input
             placeholder='email'
             onChange={(emailInput) => this.setState({emailInput})}
             value={this.state.emailInput}
             type="text"
             autoCapitalize='none'
           />
         </div>
         <div>
           <input
             placeholder='password'
             onChange={(passwordInput) => this.setState({passwordInput})}
             value={this.state.passwordInput}
             type="text"
             autoCapitalize='none'
           />
         </div>
        <input type="submit" value="Submit" className={s.submit}/>
      </form>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleFBLogin = this.handleFBLogin.bind(this);
  }

  handleFBLogin() {
    const provider = new firebaseAuth.FacebookAuthProvider();
    provider.addScope('email, public_profile, user_friends');
    firebaseAuth().signInWithPopup(provider)
    .then((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      console.log('token', token);
      const user = result.user;
      console.log('user: ', user);
      // ...
      // The signed-in user info.
    }).catch((error) => {
      console.error(error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebaseAuth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className={s.root}>
          <div className={s.container}>
            <h1>Login</h1>
            <LoginForm />
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.handleFBLogin}>
              Login with Facebook
            </button>
          </div>
        </div>
        <Footer />
    </div>
    );
  }
}


export default Login;
