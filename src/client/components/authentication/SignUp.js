import React from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup, List, Image } from 'semantic-ui-react';
import HeaderContainer from '../header/containers/HeaderContainer.js';
import s from './Register.css';
import RegisterFormContainer from './containers/RegisterFormContainer.js';
import { ref, firebaseAuth } from '../../config';
import Logo from '../logo/Logo.js';

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
    this.props.enterSignupPage();
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
        this.props.setIsWeakPassword(true);
        this.props.setPasswordErrorMessage('The password is too weak.')
      } else {
        this.props.setIsWeakPassword(false);
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
      this.props.setIsEmailValidated(true);
    } else {
      this.props.setEmailErrorMessage('Hmm...that doesn\'t look like an email address.');
      this.props.setIsEmailValidated(false);
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

  async handleEmailContinue() {
    await console.log('handleEmailContinue is executing/executed');
    this.props.resetErrorMessageStates();
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
        this.props.setIsEmailAlreadyInUse(true);
        this.props.setEmailErrorMessage('This email is already in use. Please log in or register with another email.');
        // else if email doesn't exist
      } else if (doesUserEmailExist && isUserFacebookAuth) {
        this.props.setIsExistingUserFBAuth(true);
        his.props.setEmailErrorMessage('This email is associated with a Facebook account. Please continue with Facebook.');
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
          this.props.setFirebaseAccessToken(firebaseAccessToken);
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
          this.props.setUserWantsEmailSignup(true);
          this.props.setRouteToRegisterForm(true);
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
        <HeaderContainer />
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
                userAuthorized={this.props.appReducers.userAuthorized}
              />
              :
              <div>
                <Logo />
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
                        onChange={(event) => this.props.setEmailInput(event.target.value)}
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
                        onChange={(event) => this.props.setPasswordInput(event.target.value)}
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

export default SignUp;
