import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux'
import * as appActionCreators from '../../action-creators/appActions';
import * as loginActionCreators from '../../action-creators/loginActions'
import * as signUpActionCreators from '../../action-creators/signUpActions'
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

    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
  }

  componentWillMount() {
    console.log('Signup is mounting');
    this.props.dispatch(signUpActionCreators.enterSignupPage());
  }

  async createNativeUser (email, pw) {
    return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then((user) => {
      return user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        this.props.dispatch(signUpActionCreators.setIsWeakPassword(true));
        this.props.dispatch(loginActionCreators.setPasswordErrorMessage('The password is too weak.'))
      } else {
        this.props.dispatch(signUpActionCreators.setIsWeakPassword(false));
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
        emailInput: this.props.emailInput,
      }),
    })
    const responseData = await response.json();
    if (responseData.emailValidated) {
      this.props.dispatch(loginActionCreators.setIsEmailValidated(true));
    } else {
      this.props.dispatch(loginActionCreators.setEmailErrorMessage('Hmm...that doesn\'t look like an email address.'));
      this.props.dispatch(loginActionCreators.setIsEmailValidated(false));
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
      this.props.dispatch(loginActionCreators.setIsPasswordValidated(true));
    } else {
      this.props.dispatch(loginActionCreators.setIsPasswordValidated(false));
      this.props.dispatch(loginActionCreators.setPasswordErrorMessage('Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number.'));
    }
  }

  async handleEmailContinue() {
    await console.log('handleEmailContinue is executing/executed');
    this.props.dispatch(loginActionCreators.resetErrorMessageStates());
    await this.validatePassword();
    let firebaseEmailSignUpUser;
    let firebaseAccessToken;
    await this.validateEmail();
    if (this.props.isEmailValidated) {
      // declare variable that sends post request of email to server
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
      const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
      const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
      const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
      // if email exists and hasUserFinishedSignUp is false
      if (doesUserEmailExist && !hasUserFinishedSignUp && !isUserFacebookAuth) {
        // tell user to login because email exists
        this.props.dispatch(signUpActionCreators.setIsEmailAlreadyInUse(true));
        this.props.dispatch(loginActionCreators.setEmailErrorMessage('This email is already in use. Please log in or register with another email.'));
        // else if email doesn't exist
      } else if (doesUserEmailExist && isUserFacebookAuth) {
        this.props.dispatch(signUpActionCreators.setIsExistingUserFBAuth(true));
        his.props.dispatch(loginActionCreators.setEmailErrorMessage('This email is associated with a Facebook account. Please continue with Facebook.'));
      } else if (!doesUserEmailExist) {
        // go through logic
        if (this.props.isPasswordValidated) {
          firebaseEmailSignUpUser = await this.createNativeUser(this.props.emailInput, this.props.passwordInput);
          const currentFirebaseUser = await firebaseAuth().currentUser;
          const sendEmailVerification = await currentFirebaseUser.sendEmailVerification();
          await console.log('sendEmailVerification successful.');
        }
        const isValidLogin = !(!this.props.isEmailValidated || this.props.isEmailAlreadyInUse); // TODO MAKE BETTER
        if (isValidLogin && this.props.isPasswordValidated) {
          firebaseAccessToken = await firebaseAuth().currentUser.getIdToken(/* forceRefresh */ true);
          this.props.dispatch(appActionCreators.setFirebaseAccessToken(firebaseAccessToken));
          const response = await fetch('/auth/signup/email-signup/save', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
              firebaseAccessToken,
              email: this.props.emailInput,
            }),
          });
          const responseData = await response.json();
          this.props.dispatch(appActionCreators.setUserWantsEmailSignup(true));
          this.props.dispatch(appActionCreators.setRouteToRegisterForm(true));
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
                emailInput={this.props.emailInput}
                passwordInput={this.props.passwordInput}
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
                        onChange={(event) => this.props.dispatch(loginActionCreators.setEmailInput(event.target.value))}
                      />
                    }
                    content={this.props.emailErrorMessage}
                    open={this.props.isEmailAlreadyInUse || this.props.isExistingUserFBAuth || this.props.isEmailValidated === false}
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
                        onChange={(event) => this.props.dispatch(loginActionCreators.setPasswordInput(event.target.value))}
                      />
                      }
                      content={this.props.passwordErrorMessage}
                      open={(this.props.isWeakPassword || this.props.isPasswordValidated === false) && this.props.isEmailValidated === true && this.props.isEmailAlreadyInUse === false && this.props.isExistingUserFBAuth === false}
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
    isEmailValidated: state.loginReducer._isEmailValidated, // TODO RENAME
    isPasswordValidated: state.loginReducer._isPasswordValidated,
    emailErrorMessage: state.loginReducer._emailErrorMessage,
    passwordErrorMessage: state.loginReducer._passwordErrorMessage,

    // signUpReducers
    isWeakPassword: state.signUpReducer._isWeakPassword,
    isEmailAlreadyInUse: state.signUpReducer._isEmailAlreadyInUse,
    isExistingUserFBAuth: state.signUpReducer._isExistingUserFBAuth,
  }
};

const ConnectedSignUp = connect(mapStateToProps)(SignUp);
export default ConnectedSignUp;
