import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Register.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import { ref, firebaseAuth } from '../../config'

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      passwordInput: '',
      photoURL: '',
      facebookData: '',
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
         <input
           value={this.state.firstName}
           placeholder='First Name'
           onChange={(firstName) => this.setState({firstName})}
           autoCapitalize='none'
           type="text"
         />
         <div>
         <input
           value={this.state.lastName}
           placeholder='Last Name'
           onChange={(lastName) => this.setState({lastName})}
           autoCapitalize='none'
           type="text"
         />
       </div>
       <div>
         <input
           value={this.state.email}
           placeholder='Email'
           onChange={(email) => this.setState({email})}
           autoCapitalize='none'
           type="email"
         />
       </div>
       <div>
         <input
           keyboardType='phone-pad'
           placeholder='(XXX)XXX-XXXX'
           onChange={(phoneNumber) => this.setState({phoneNumber})}
           value={this.state.phoneNumber}
           autoCapitalize='none'
         />
         <div>
         <input
          placeholder='password'
          onChange={(passwordInput) => this.setState({passwordInput})}
          value={this.state.passwordInput}
          autoCapitalize='none'
        />
      </div>
      <div>
        <input
          placeholder='repeat password'
          autoCapitalize='none'
        />
      </div>
       </div>
       <div>
        <input type="submit" value="Submit" className={s.submit}/>
      </div>
      </form>
    );
  }
}

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
  }

  async handleFBSignUp() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
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
