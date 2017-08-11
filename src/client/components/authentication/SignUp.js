import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Icon, Popup } from 'semantic-ui-react';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config';
import { createNativeUser } from '../../utils/auth.js';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      userAllowedContinue: false,
      isPasswordValidated: '',
      userWantsEmailSignup: false,
      facebookData: '',
      isInvalidEmail: '',
      isWeakPassword: '',
      isEmailAlreadyInUse: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
  }

  async createNativeUser (email, pw) {
    await this.setState({ hasFirebaseChecked: true });
    return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid-email') {
        this.setState({ isInvalidEmail: true });
      } else {
        this.setState({ isInvalidEmail: false });
      }
      if (errorCode === 'auth/email-already-in-use') {
        this.setState({ isEmailAlreadyInUse: true });
      } else {
        this.setState({ isEmailAlreadyInUse: false });
      }
      if (errorCode === 'auth/weak-password') {
        this.setState({ isWeakPassword: true });
      } else {
        this.setState({ isWeakPassword: false });
      }
      console.log(error);
    });
  }

  async validatePassword() {
    const response = await fetch('/auth/password', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        passwordInput: this.state.passwordInput,
      }),
    })
    const responseData = await response.json();
    if (responseData.passwordValidated) {
      await this.setState({ isPasswordValidated: true });
    } else {
      await this.setState({ isPasswordValidated: false });
    }
  }

  resetErrorStates() {
    this.setState({ isPasswordValidated: '' });
    this.setState({ isInvalidEmail: '' });
    this.setState({ isEmailAlreadyInUse: '' });
  }

  async handleEmailContinue() {
    await this.resetErrorStates();
    await this.validatePassword();
    if (this.state.isPasswordValidated) {
      await this.createNativeUser(this.state.emailInput, this.state.passwordInput);
    }
    const isValidLogin = !(this.state.isInvalidEmail || this.state.isEmailAlreadyInUse);
    if (isValidLogin && this.state.isPasswordValidated) {
      console.log('this.state.isEmailAlreadyInUse; ', this.state.isEmailAlreadyInUse);
      await this.setState({ userWantsEmailSignup: true });
      await this.setState({ userAllowedContinue: true });
    }
  }

  async handleFBSignUp() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    const token = result.credential.accessToken;
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
    await this.setState({ userAllowedContinue: true });
    const idToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    const firebaseResponse = await fetch('/auth/basic/home', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        idToken,
      }),
    });
    const firebaseResponseData = await firebaseResponse.json();
    console.log('responseData: ', firebaseResponseData);
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
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    };
    return (
      <div>
        <div className={s.root}>
          <div className={s.container}>
            {this.state.userAllowedContinue ?
              <RegisterForm
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                emailInput={this.state.emailInput}
                passwordInput={this.state.passwordInput}
                facebookData={this.state.facebookData}
              />
              :
              <div>
                <img
                  src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2 className={s.head}>Welcome to Collective!</h2>
                <div>
                  {this.state.isEmailAlreadyInUse === true ?
                    <div>
                    <MailOutline />
                    <Popup
                      trigger={<TextField
                        type="email"
                        hintText="Email"
                        style={styles.iconStyles}
                        onChange={(event) => this.setState({ emailInput: event.target.value }, () => {console.log(this.state.emailInput)})}
                      />
                    }
                    content="This email is already in use"
                    open={this.state.isEmailAlreadyInUse === true}
                    offset={20}
                    position="right center"
                    /><br />
                    </div>
                    :
                    <div>
                    <MailOutline />
                    <Popup
                      trigger={
                        <TextField
                          type="email"
                          hintText="Email"
                          style={styles.iconStyles}
                          onChange={(event) => this.setState({ emailInput: event.target.value }, () => {console.log(this.state.emailInput)})}
                        />
                    }
                      content="Hmm...that doesn't look like an email address."
                      open={this.state.isInvalidEmail === true}
                      offset={20}
                      position="right center"
                    /><br />
                  </div>
                  }
                  {this.state.isWeakPassword ?
                    <div>
                      <LockOutline />
                      <Popup
                        trigger={<TextField
                          type="password"
                          hintText="Create New Password"
                          style={styles.iconStyles}
                          onChange={(event) => this.setState({ passwordInput: event.target.value })}
                        />
                        }
                        content="The password is too weak."
                        open={(this.state.isWeakPassword === true && this.state.isInvalidEmail === false && this.state.isEmailAlreadyInUse === false)}
                        offset={20}
                        position="right center"
                      /><br />
                    </div>
                    :
                    <div>
                      <LockOutline />
                      <Popup
                        trigger={<TextField
                          type="password"
                          hintText="Create New Password"
                          style={styles.iconStyles}
                          onChange={(event) => this.setState({ passwordInput: event.target.value })}
                        />
                      }
                      content="Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number."
                      open={(this.state.isPasswordValidated === false)}
                      // open={(this.state.isPasswordValidated === false && this.state.isInvalidEmail === false && this.state.isEmailAlreadyInUse === false)}
                      offset={20}
                      position="right center"
                    /><br />
                  </div>
                  }
                </div>
                <br />
                <RaisedButton label="Continue" primary={true} onClick={this.handleEmailContinue} /><br /><br />
                <button
                  className={s.loginBtn}
                  id="btn-social-login"
                  onClick={this.handleFBSignUp}
                  >
                    Continue with Facebook
                  </button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default SignUp;
