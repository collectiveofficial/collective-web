import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config'


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
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
    const styles = {
      iconStyles: {
        marginLeft: 10,
      },
      or: {
        marginTop: '3%',
        marginBottom: '3%',
      },
    };
    return (
      <div>
        <div className={s.root}>
          <div className={s.container}>
            <img
              src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
              alt="collective logo"
              height="30"
              width="30"
            />
            <h2>Welcome to Collective!</h2>
            <div>
            <MailOutline />
            <TextField
              type='email'
              hintText="Email"
              style={styles.iconStyles}
              onChange={(event) => this.setState({ emailInput: event.target.value }, () => { console.log(this.state.emailInput) })}
            /><br />
            <LockOutline />
           <TextField
            type='password'
            hintText='Password'
            style={styles.iconStyles}
            onChange={(passwordInput) => this.setState({ passwordInput: event.target.value }, () => { console.log(this.state.passwordInput) })}
           />
            </div>
            <RaisedButton label="Continue" primary={true} containerElement={<Link to="/register-form" />} />
            <div style={styles.or}>OR</div>
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.handleFBSignUp}
            >
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default SignUp;
