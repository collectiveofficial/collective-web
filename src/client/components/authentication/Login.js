import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup } from 'semantic-ui-react';
import HeaderContainer from '../header/containers/HeaderContainer.js';
import RegisterFormContainer from './containers/RegisterFormContainer.js';
import { ref, firebaseAuth } from '../../config';
import s from './Login.css';
import Logo from '../logo/Logo.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.nativeLogin = this.nativeLogin.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }
  componentWillMount() {
    console.log('Login is mounting');
    this.props.enterLoginPage();
  }

  async validateEmail() {
    const response = await fetch('/auth/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        emailInput: this.props.emailInput,
      }),
    });
    const responseData = await response.json();
    if (responseData.emailValidated) {
      this.props.setIsEmailValidated(true);
    } else {
      this.props.setIsEmailValidated(false);
      this.props.setEmailErrorMessage('Hmm...that doesn\'t look like an email address.');
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
        passwordInput: this.props.passwordInput,
      }),
    })
    const responseData = await response.json();
    if (responseData.passwordValidated) {
      this.props.setIsPasswordValidated(true);
    } else {
      this.props.setIsPasswordValidated(false);
      this.props.setPasswordErrorMessage('Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number.');
    }
  }

  async nativeLogin(email, password) {
    const user = await firebaseAuth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        this.props.setIsWrongPassword(true);
        this.props.setPasswordErrorMessage('Wrong password.');
      }
      if (errorCode === 'auth/user-disabled') {
        this.props.setIsUserDisabled(true);
        this.props.setEmailErrorMessage('User disabled.');
      }
      if (errorCode === 'auth/user-not-found') {
        this.props.setIsUserNotFound(true);
        this.props.setEmailErrorMessage('User not found.');
      }
      console.log(error);
    });
    return user;
  }

  async handleEmailContinue(event) {
    event.preventDefault();
    this.props.resetLoginErrorStates();
    await this.validateEmail();
    await this.validatePassword();
    if (this.props.isEmailValidated && this.props.isPasswordValidated) {
      const user = await this.nativeLogin(this.props.emailInput, this.props.passwordInput);
      const checkEmailResponse = await fetch('/auth/signup/check-email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          email: this.props.emailInput,
        }),
      });
      const checkEmailResponseData = await checkEmailResponse.json();
      console.log('Login checkEmailResponseData: ', checkEmailResponseData);
      const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
      const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
      const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
      if (doesUserEmailExist && hasUserFinishedSignUp && !isUserFacebookAuth) {
        await this.props.authorizeUser();
      }
      const routeToRegisterForm = doesUserEmailExist && !hasUserFinishedSignUp && !isUserFacebookAuth;
      if (routeToRegisterForm) {
        const firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
        this.props.setFirebaseAccessToken(firebaseAccessToken);
        this.props.setUserWantsEmailSignup(true);
      }

      this.props.setRouteToRegisterForm(routeToRegisterForm);
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
    };
    return (
      <div>
        {/* <HeaderContainer /> */}
        <div className={s.root}>
          <div className={s.container}>
            {this.props.appReducers.routeToRegisterForm ?
              <RegisterFormContainer
                authorizeUser={this.props.authorizeUser}
                userWantsEmailSignup={this.props.appReducers.userWantsEmailSignup}
                emailInput={this.props.emailInput}
                passwordInput={this.props.passwordInput}
                facebookData={this.props.appReducers.facebookData}
                firebaseAccessToken={this.props.appReducers.firebaseAccessToken}
              />
              :
              <div>
                <Logo />
                <h2>Log in to Collective</h2>
                <h2>Built to empower groups</h2>
                <div>
                  <MailOutline />
                  <Popup
                    trigger={<TextField
                      hintText="Email"
                      style={styles.iconStyles}
                      onChange={(event) => this.props.setEmailInput(event.target.value)}
                    />
                  }
                  content={this.props.emailErrorMessage}
                  open={this.props.isEmailValidated === false || this.props.isUserDisabled === true || this.props.isUserNotFound === true}
                  offset={20}
                  position="right center"
                /><br />
                <LockOutline />
                <Popup
                  trigger={<TextField
                    type="password"
                    hintText="Password"
                    style={styles.iconStyles}
                    onChange={(event) => this.props.setPasswordInput(event.target.value)}
                  />
                }
                content={this.props.passwordErrorMessage}
                open={(this.props.isPasswordValidated === false || this.props.isWrongPassword === true) && (this.props.isEmailValidated === true && this.props.isUserDisabled !== true && this.props.isUserNotFound !== true)}
                offset={20}
                position="right center"
              /><br />
            </div>
            <RaisedButton label="Log in" type="submit" primary={true} onTouchTap={this.handleEmailContinue} />
            <br /> <br />
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.props.handleFacebookAuth}>
              Login with Facebook
            </button>
          </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
