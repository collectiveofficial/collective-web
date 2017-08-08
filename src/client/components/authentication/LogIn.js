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
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.nativeLogin = this.nativeLogin.bind(this);
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

  async nativeLogin(email, password) {
    const user = await firebaseAuth().signInWithEmailAndPassword(email, password);
    await this.setState({ firebaseAccessToken: user.ie });
    await console.log(this.state.firebaseAccessToken);
    await this.setState({ userWantsEmailSignup: true });
    await console.log('this.state.userWantsEmailSignup', this.state.userWantsEmailSignup);
    return user;
  }

  async handleEmailContinue(event) {
    event.preventDefault();
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
                open={this.state.isPasswordValidated === false && this.state.isEmailValidated === true}
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
        </div>
      </div>
    );
  }
}


export default Login;
