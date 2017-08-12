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
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config'
import s from './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      isEmailValidated: '',
      isPasswordValidated: '',
      routeToRegisterForm: false,
      firebaseAccessToken: '',
      userWantsEmailSignup: false,
      wrongPassword: '',
      userDisabled: '',
      userNotFound: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
    };
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
        emailInput: this.state.emailInput,
      }),
    });
    const responseData = await response.json();
    await console.log('responseData: ', responseData);
    if (responseData.emailValidated) {
      await this.setState({ isEmailValidated: true });
    } else {
      await this.setState({ isEmailValidated: false });
      await this.setState({ emailErrorMessage: 'Hmm...that doesn\'t look like an email address.' });
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

  async nativeLogin(email, password) {
    const user = await firebaseAuth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        this.setState({ wrongPassword: true });
        this.setState({ passwordErrorMessage: 'Wrong password.' });
      }
      if (errorCode === 'auth/user-disabled') {
        this.setState({ userDisabled: true });
        this.setState({ emailErrorMessage: 'User disabled.' });
      }
      if (errorCode === 'auth/user-not-found') {
        this.setState({ userNotFound: true });
        this.setState({ emailErrorMessage: 'User not found.' });
      }
      console.log(error);
    });
    await this.setState({ firebaseAccessToken: user.ie }); // TODO
    await console.log(this.state.firebaseAccessToken);
    await this.setState({ userWantsEmailSignup: true });
    await console.log('this.state.userWantsEmailSignup', this.state.userWantsEmailSignup);
    return user;
  }

  resetErrorStates() {
    this.setState({ isPasswordValidated: '' });
    this.setState({ isInvalidEmail: '' });
    this.setState({ wrongPassword: '' });
    this.setState({ userDisabled: '' });
    this.setState({ userNotFound: '' });
  }

  async handleEmailContinue(event) {
    event.preventDefault();
    await this.resetErrorStates();
    await this.validateEmail();
    await this.validatePassword();
    if (this.state.isEmailValidated && this.state.isPasswordValidated) {
      const user = await this.nativeLogin(this.state.emailInput, this.state.passwordInput);
      // const email = user.email;
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
      console.log('Login checkEmailResponseData: ', checkEmailResponseData);
      const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
      const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
      const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
      if (doesUserEmailExist && hasUserFinishedSignUp && !isUserFacebookAuth) {
        await this.props.authorizeUser();
      }
      const routeToRegisterForm = doesUserEmailExist && !hasUserFinishedSignUp && !isUserFacebookAuth;
      await this.setState({ routeToRegisterForm }, () => {
        console.log('Inside setState, this.state.routeToRegisterForm: ', this.state.routeToRegisterForm);
      });
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
            {this.props.routeToRegisterForm || this.state.routeToRegisterForm ?
              <RegisterForm
                authorizeUser={this.props.authorizeUser}
                userWantsEmailSignup={this.state.userWantsEmailSignup}
                emailInput={this.state.emailInput}
                passwordInput={this.state.passwordInput}
                facebookData={this.props.facebookData}
                firebaseAccessToken={this.props.firebaseAccessToken.length > 0 ? this.props.firebaseAccessToken : this.state.firebaseAccessToken}
              />
              :
              <form onSubmit={this.handleEmailContinue}>
                <img
                  src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
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
                      onChange={(event) => this.setState({ emailInput: event.target.value })}
                    />
                  }
                  content={this.state.emailErrorMessage}
                  open={this.state.isEmailValidated === false || this.state.userDisabled === true || this.state.userNotFound === true}
                  offset={20}
                  position="right center"
                /><br />
                <LockOutline />
                <Popup
                  trigger={<TextField
                    // ref="password"
                    type="password"
                    hintText="Password"
                    style={styles.iconStyles}
                    onChange={(event) => this.setState({ passwordInput: event.target.value })}
                  />
                }
                content={this.state.passwordErrorMessage}
                open={(this.state.isPasswordValidated === false || this.state.wrongPassword === true) && (this.state.isEmailValidated === true && this.state.userDisabled !== true && this.state.userNotFound !== true)}
                offset={20}
                position="right center"
              /><br />
            </div>
            <RaisedButton label="Log in" type="submit" primary={true} />
            <div style={styles.or}>OR</div>
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.props.handleFacebookAuth}>
              Login with Facebook
            </button>
          </form>
            }
          </div>
          {/* {this.props.userAuthorized ?
            <Redirect to="/home" />
            :
            <div></div>
          } */}
        </div>
      </div>
    );
  }
}


export default Login;
