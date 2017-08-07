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
      userCredentialsValidated: false,
      isEmailValidated: '',
      isPasswordValidated: '',
      routeToRegisterForm: false,
      firebaseAccessToken: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
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
      await console.log('response.emailValidated: ', response.emailValidated);
      await this.setState({ isEmailValidated: false });
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
    }
  }

  async handleEmailContinue() {
    await this.validateEmail();
    await this.validatePassword();
    if (this.state.isEmailValidated && this.state.isPasswordValidated) {
      const user = await this.props.nativeLogin(this.state.emailInput, this.state.passwordInput);
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
      // if (this.props.unmounted) {
      const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
      const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
      const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
      const routeToRegisterForm = doesUserEmailExist && !hasUserFinishedSignUp && !isUserFacebookAuth;
      await this.setState({ routeToRegisterForm }, () => {
        console.log('Inside setState, this.state.routeToRegisterForm: ', this.state.routeToRegisterForm);
      });
      // }
      // await console.log('routeToRegisterForm: ', routeToRegisterForm);
      // // if (routeToRegisterForm) {
      // await this.setState({ routeToRegisterForm }, () => {
      //   console.log('Inside setState, this.state.routeToRegisterForm: ', this.state.routeToRegisterForm);
      // });
      // await console.log('Outside setState, this.state.routeToRegisterForm: ', this.state.routeToRegisterForm);
      // // }
    }
  }

  async handleFBLogin() {
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
    const loginResponse = await fetch('/auth/facebook/check', {
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
    const loginResponseData = await loginResponse.json();
    console.log('responseData: ', loginResponseData);
    const userAlreadyExists = loginResponseData.userAlreadyExists;
    const hasUserFinishedSignUp = loginResponseData.hasUserFinishedSignUp;
    const saveUserOnFacebookSignUpExecuted = loginResponseData.saveUserOnFacebookSignUpExecuted;
    if (userAlreadyExists && hasUserFinishedSignUp) {
      console.log('authorize user');
    } else if ((userAlreadyExists && !hasUserFinishedSignUp) || saveUserOnFacebookSignUpExecuted) {
      // route to register form
      await this.setState({ routeToRegisterForm: true });
    }
    // const provider = await new firebaseAuth.FacebookAuthProvider();
    // await provider.addScope('email, public_profile, user_friends');
    // const result = await firebaseAuth().signInWithPopup(provider);
    // const firebaseAccessToken = result.user.ie;
    // const authorizeUser = await fetch('/auth/login/facebook', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    //   body: JSON.stringify({
    //     firebaseAccessToken,
    //   }),
    // });
    // const authorizeUserData = await authorizeUser.json();
    // const doesUserExist = authorizeUserData.doesUserExist;
    // const hasUserFinishedSignUp = authorizeUserData.hasUserFinishedSignUp;
    // if (!doesUserExist) {
    //   console.log('save user data and follow through on signup process');
    // } else if (doesUserExist && hasUserFinishedSignUp) {
    //   console.log('authorize user');
    // } else if (doesUserExist && !hasUserFinishedSignUp) {
    //   console.log('route to /register-form');
    // }
    // const email = result.user.email;
    // const checkEmailResponse = await fetch('/auth/signup/check-email', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    //   body: JSON.stringify({
    //     email,
    //   }),
    // });
    // const checkEmailResponseData = await checkEmailResponse.json();
    // const doesUserEmailExist = checkEmailResponseData.doesUserEmailExist;
    // const hasUserFinishedSignUp = checkEmailResponseData.hasUserFinishedSignUp;
    // const isUserFacebookAuth = checkEmailResponseData.isUserFacebookAuth;
    // if (doesUserEmailExist && hasUserFinishedSignUp && isUserFacebookAuth) {
    //   console.log('authorize user');
    // } else if ((doesUserEmailExist && !hasUserFinishedSignUp && isUserFacebookAuth) || !doesUserEmailExist) {
    //   console.log('route to /register-form');
    // }
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
          <form className={s.container} onSubmit={this.handleEmailContinue}>
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
                  type="email"
                  hintText="Email"
                  style={styles.iconStyles}
                  onChange={(event) => this.setState({ emailInput: event.target.value })}
                />
              }
                content="Hmm...that doesn't look like an email address."
                open={this.state.isEmailValidated === false}
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
                content="Your password needs a minimum of 8 characters with at least one uppercasee letter, one lowercase letter and one number."
                open={(this.state.isPasswordValidated === false && this.state.isEmailValidated === true)}
                offset={20}
                position="right center"
            /><br />
            </div>
            <RaisedButton label="Log in" type="submit" primary={true} />
            <div style={styles.or}>OR</div>
            <button
              className={s.loginBtn}
              id="btn-social-login"
              onClick={this.handleFBLogin}>
              Login with Facebook
            </button>
            {/* {this.state.routeToRegisterForm ?
              <Redirect to='/register-form' />
              :
              <div></div>
            } */}
          </form>
        </div>
      </div>
    );
  }
}


export default Login;
