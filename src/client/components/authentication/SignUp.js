import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup } from 'semantic-ui-react';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      userAllowedContinue: false,
      userWantsEmailSignup: false,
      facebookData: '',
      isPasswordValidated: '',
      isInvalidEmail: '',
      isWeakPassword: '',
      isEmailAlreadyInUse: '',
      firebaseAccessToken: '',
      isExistingUserFBAuth: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
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
          firebaseAccessToken = firebaseEmailSignUpUser.ie;
          await this.setState({ firebaseAccessToken });
        }
        const isValidLogin = !(this.state.isInvalidEmail || this.state.isEmailAlreadyInUse);
        if (isValidLogin && this.state.isPasswordValidated) {
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
          await this.setState({ userWantsEmailSignup: true });
          await this.setState({ userAllowedContinue: true });
        }
      }
    }
  }

  async handleFBSignUp() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    await console.log('firebaseAuth result: ', result);
    const firebaseAccessToken = result.user.ie;
    await this.setState({ firebaseAccessToken });
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
    await this.setState({ facebookData: responseData.facebook_payload }, () => {
      console.log('this.state.facebookData: ', this.state.facebookData);
    });
    // const idToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    const dbSaveResponse = await fetch('/auth/signup/facebook/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken,
        firstName: this.state.facebookData.first_name,
        lastName: this.state.facebookData.last_name,
        email: this.state.facebookData.email,
        pictureUrl: this.state.facebookData.picture.data.url,
      }),
    });
    const dbSaveResponseData = await dbSaveResponse.json();
    console.log('responseData: ', dbSaveResponseData);
    const userAlreadyExists = dbSaveResponseData.userAlreadyExists;
    const hasUserFinishedSignUp = dbSaveResponseData.hasUserFinishedSignUp;
    const saveUserOnFacebookSignUpExecuted = dbSaveResponseData.saveUserOnFacebookSignUpExecuted;
    if (userAlreadyExists && hasUserFinishedSignUp) {
      console.log('authorize user');
    } else if ((userAlreadyExists && !hasUserFinishedSignUp) || saveUserOnFacebookSignUpExecuted) {
      await this.setState({ userAllowedContinue: true });
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
            {this.state.userAllowedContinue ?
              <RegisterForm
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                emailInput={this.state.emailInput}
                passwordInput={this.state.passwordInput}
                facebookData={this.state.facebookData}
                firebaseAccessToken={this.state.firebaseAccessToken}
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
                </div>
                <RaisedButton label="Continue" primary={true} onClick={this.handleEmailContinue} /><br /><br />
                <div style={styles.or}>OR</div>
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
