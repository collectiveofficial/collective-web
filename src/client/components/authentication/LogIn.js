import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux'
import * as appActionCreators from '../../action-creators/appActions';
import * as loginActionCreators from '../../action-creators/loginActions'
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup } from 'semantic-ui-react';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config'
import s from './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.nativeLogin = this.nativeLogin.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
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
      // await this.setState({ isEmailValidated: true });
      this.props.dispatch(loginActionCreators.setIsEmailValidated(true));
    } else {
      // await this.setState({ isEmailValidated: false });
      // await this.setState({ emailErrorMessage: 'Hmm...that doesn\'t look like an email address.' });
      this.props.dispatch(loginActionCreators.setIsEmailValidated(false));
      this.props.dispatch(loginActionCreators.setEmailErrorMessage('Hmm...that doesn\'t look like an email address.'));
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
      // await this.setState({ isPasswordValidated: true });
      this.props.dispatch(loginActionCreators.setIsPasswordValidated(true));
    } else {
      // await this.setState({ isPasswordValidated: false });
      // await this.setState({ passwordErrorMessage: 'Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number.' });
      this.props.dispatch(loginActionCreators.setIsPasswordValidated(false));
      this.props.dispatch(loginActionCreators.setPasswordErrorMessage('Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number.'));
    }
  }

  async nativeLogin(email, password) {
    const user = await firebaseAuth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        // this.setState({ isWrongPassword: true });
        // this.setState({ passwordErrorMessage: 'Wrong password.' });
        this.props.dispatch(loginActionCreators.setIsWrongPassword(true));
        this.props.dispatch(loginActionCreators.setPasswordErrorMessage('Wrong password.'));
      }
      if (errorCode === 'auth/user-disabled') {
        // this.setState({ isUserDisabled: true });
        // this.setState({ emailErrorMessage: 'User disabled.' });
        this.props.dispatch(loginActionCreators.setIsUserDisabled(true));
        this.props.dispatch(loginActionCreators.setEmailErrorMessage('User disabled.'));
      }
      if (errorCode === 'auth/user-not-found') {
        // this.setState({ isUserNotFound: true });
        // this.setState({ emailErrorMessage: 'User not found.' });
        this.props.dispatch(loginActionCreators.setIsUserNotFound(true));
        this.props.dispatch(loginActionCreators.setEmailErrorMessage('User not found.'));
      }
      console.log(error);
    });
    return user;
  }

  resetErrorStates() {
    // this.setState({ isPasswordValidated: '' });
    // this.setState({ isWrongPassword: '' });
    // this.setState({ isUserDisabled: '' });
    // this.setState({ isUserNotFound: '' });
    this.props.dispatch(loginActionCreators.setIsEmailValidated(''));
    this.props.dispatch(loginActionCreators.setIsPasswordValidated(''));r
    this.props.dispatch(loginActionCreators.setEmailErrorMessage(''));
    this.props.dispatch(loginActionCreators.setEmailErrorMessage(''));
    this.props.dispatch(loginActionCreators.setEmailErrorMessage(''));
  }

  async handleEmailContinue(event) {
    event.preventDefault();
    await this.resetErrorStates();
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
        const firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
        // await this.props.setFirebaseAccessTokenState(firebaseAccessToken);
        // await this.props.setUserWantsEmailSignupState(true);
        this.props.dispatch(appActionCreators.setFirebaseAccessToken(firebaseAccessToken));
        this.props.dispatch(appActionCreators.setUserWantsEmailSignup(true));
      }
      // await this.props.setRouteToRegisterFormState(routeToRegisterForm);
      this.props.dispatch(appActionCreators.setRouteToRegisterForm(routeToRegisterForm));
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
        <div className={s.root}>
          <div className={s.container}>
            {this.props.routeToRegisterForm ?
              <RegisterForm
                authorizeUser={this.props.authorizeUser}
                userWantsEmailSignup={this.props.userWantsEmailSignup}
                emailInput={this.props.emailInput}
                passwordInput={this.props.passwordInput}
                facebookData={this.props.facebookData}
                firebaseAccessToken={this.props.firebaseAccessToken}
              />
              :
              <div>
                <img
                  src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/20842268_10203444885799076_8463083618137206538_n.jpg?oh=9d92d9a15f4d4eec45c6564d25b2b736&oe=5A19812C"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2>Log in to see more</h2>
                <div>
                  <MailOutline />
                  <Popup
                    trigger={<TextField
                      hintText="Email"
                      style={styles.iconStyles}
                      onChange={(event) => this.props.dispatch(loginActionCreators.setEmailInput(event.target.value))}
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
                    onChange={(event) => this.props.dispatch(loginActionCreators.setPasswordInput(event.target.value))}
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

const mapStateToProps = (state, props) => {
  return {
    // appReducers
    userAuthorized: state.appReducer._userAuthorized,
    firebaseAccessToken: state.appReducer._firebaseAccessToken,
    routeToRegisterForm: state.appReducer._routeToRegisterForm,
    userWantsEmailSignup: state.appReducer._userWantsEmailSignup,
    facebookData: state.appReducer._facebookData,

    // loginReducers
    emailInput: state.loginReducer._emailInput,
    passwordInput: state.loginReducer._passwordInput,
    isEmailValidated: state.loginReducer._isEmailValidated,
    isPasswordValidated: state.loginReducer._isPasswordValidated,
    isWrongPassword: state.loginReducer._isWrongPassword,
    emailErrorMessage: state.loginReducer._emailErrorMessage,
    isUserDisabled:state.loginReducer._isUserDisabled,
    isUserNotFound:state.loginReducer._isUserNotFound,
    passwordErrorMessage: state.loginReducer._passwordErrorMessage,
  }
};

const ConnectedLogin = connect(mapStateToProps)(Login);

export default ConnectedLogin;
