import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Icon, Popup, List, Image } from 'semantic-ui-react';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      isPasswordValidated: '',
      isInvalidEmail: '',
      isWeakPassword: '',
      isEmailAlreadyInUse: '',
      isExistingUserFBAuth: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
  }

  componentWillUnmount() {
    console.log('Signup is unmounted');
    console.log('this.state.isPasswordValidated', this.state.isPasswordValidated);
  }

  async createNativeUser (email, pw) {
    await this.setState({ hasFirebaseChecked: true });
    return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then((user) => {
      return user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        this.setState({ isWeakPassword: true });
        this.setState({ passwordErrorMessage: 'The password is too weak.' });
      } else {
        this.setState({ isWeakPassword: false });
      }
      console.log(error);
    });
  }

  async validateEmail() {
    const response = await fetch('/auth/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        emailInput: this.state.emailInput,
      }),
    })
    const responseData = await response.json();
    if (responseData.emailValidated) {
      await this.setState({ isInvalidEmail: false });
    } else {
      await this.setState({ emailErrorMessage: 'Hmm...that doesn\'t look like an email address.' });
      await this.setState({ isInvalidEmail: true });
    }
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
      await this.setState({ passwordErrorMessage: 'Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number.' });
    }
  }

  resetErrorStates() {
    this.setState({ isPasswordValidated: false });
    this.setState({ isInvalidEmail: false });
    this.setState({ isEmailAlreadyInUse: false });
    this.setState({ isExistingUserFBAuth: false });
  }

  async handleEmailContinue() {
    await console.log('handleEmailContinue is executing/executed');
    await this.resetErrorStates();
    await this.validatePassword();
    let firebaseEmailSignUpUser;
    let firebaseAccessToken;
    await this.validateEmail();
    if (!this.state.isInvalidEmail) {
      // declare variable that sends post request of email to server
      const checkEmailResponse = await fetch('/auth/signup/check-email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          email: this.state.emailInput,
        }),
      });
      const checkEmailResponseData = await checkEmailResponse.json();
      const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
      const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
      const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
      // if email exists and hasUserFinishedSignUp is false
      if (doesUserEmailExist && !hasUserFinishedSignUp && !isUserFacebookAuth) {
        // tell user to login because email exists
        await this.setState({ isEmailAlreadyInUse: true });
        await this.setState({ emailErrorMessage: 'This email is already in use. Please log in or register with another email.' });
        // else if email doesn't exist
      } else if (doesUserEmailExist && isUserFacebookAuth) {
        await this.setState({ isExistingUserFBAuth: true });
        await this.setState({ emailErrorMessage: 'This email is associated with a Facebook account. Please continue with Facebook.' });
      } else if (!doesUserEmailExist) {
        // go through logic
        if (this.state.isPasswordValidated) {
          firebaseEmailSignUpUser = await this.createNativeUser(this.state.emailInput, this.state.passwordInput);
          const currentFirebaseUser = await firebaseAuth().currentUser;
          const sendEmailVerification = await currentFirebaseUser.sendEmailVerification();
          await console.log('sendEmailVerification successful.');
        }
        const isValidLogin = !(this.state.isInvalidEmail || this.state.isEmailAlreadyInUse);
        if (isValidLogin && this.state.isPasswordValidated) {
          firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(true);
          await this.props.setFirebaseAccessTokenState(firebaseAccessToken);
          const response = await fetch('/auth/signup/email-signup/save', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
              firebaseAccessToken,
              email: this.state.emailInput,
            }),
          });
          const responseData = await response.json();
          await this.props.setUserWantsEmailSignupState(true);
          await this.props.setRouteToRegisterFormState(true);
        }
      }
    }
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
            {this.props.routeToRegisterForm ?
              <RegisterForm
                authorizeUser={this.props.authorizeUser}
                userWantsEmailSignup={this.props.userWantsEmailSignup}
                emailInput={this.state.emailInput}
                passwordInput={this.state.passwordInput}
                facebookData={this.props.facebookData}
                firebaseAccessToken={this.props.firebaseAccessToken}
                userAuthorized={this.props.userAuthorized}
              />
              :
              <div>
                <img
                  src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/20842268_10203444885799076_8463083618137206538_n.jpg?oh=9d92d9a15f4d4eec45c6564d25b2b736&oe=5A19812C"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2 className={s.head}>Welcome to Collective</h2>
                <h2 className={s.head}>Built to empower groups</h2>
                <div>
                  <div>
                    <MailOutline />
                    <Popup
                      trigger={<TextField
                        type="email"
                        hintText="Email"
                        style={styles.iconStyles}
                        onChange={(event) => this.setState({ emailInput: event.target.value })}
                      />
                    }
                    content={this.state.emailErrorMessage}
                    open={this.state.isEmailAlreadyInUse || this.state.isExistingUserFBAuth || this.state.isInvalidEmail}
                    offset={20}
                    position="right center"
                    /><br />
                  </div>
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
                      content={this.state.passwordErrorMessage}
                      open={(this.state.isWeakPassword || this.state.isPasswordValidated === false) && this.state.isInvalidEmail === false && this.state.isEmailAlreadyInUse === false && this.state.isExistingUserFBAuth === false}
                      offset={20}
                      position="right center"
                    /><br />
                  </div>
                  <br />
                  <RaisedButton label="Continue" primary={true} onTouchTap={this.handleEmailContinue} /><br /><br />
                </div>
                <button
                  className={s.loginBtn}
                  id="btn-social-login"
                  onClick={this.props.handleFacebookAuth}
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
