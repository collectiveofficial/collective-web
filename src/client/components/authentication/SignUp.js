import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup } from 'semantic-ui-react'
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config'


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      userAllowedContinue: false,
      isEmailValidated: '',
      isPasswordValidated: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
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

  validatePassword() {
    fetch('/auth/password', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        passwordInput: this.state.passwordInput,
      }),
    })
    .then((response) => {
      if (response.passwordValidated) {
        this.setState({ isPasswordValidated: true });
      } else {
        this.setState({ isPasswordValidated: false });
      }
    })
    .catch(err => console.error(err));
  }

  handleEmailContinue() {
    this.validateEmail();
    this.validatePassword();
    if (this.state.isEmailValidated && this.state.isPasswordValidated) {
      this.setState({ userAllowedContinue: true });
    }
  }

  async handleFBSignUp() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
    const token = result.credential.accessToken;
    // const user = result.user;
    // await this.setState({ email: user.email });
    // await this.setState({ photoURL: user.photoURL });
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
            {this.state.userAllowedContinue ?
              <RegisterForm />
              :
              <div>
                <img
                  src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2>Welcome to Collective!</h2>
                <div>
                  <MailOutline />
                  <Popup
                    trigger={<TextField
                                type="email"
                                hintText="Email"
                                style={styles.iconStyles}
                                onChange={(event) => this.setState({ emailInput: event.target.value }, () => { console.log(this.state.emailInput) })}
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
                                type='password'
                                hintText='Password'
                                style={styles.iconStyles}
                                onChange={(passwordInput) => this.setState({ passwordInput: event.target.value }, () => { console.log(this.state.passwordInput) })}
                              />
                            }
                    content="Your password is too short! You need at least 8 characters!"
                    open={(this.state.isPasswordValidated === false && this.state.isEmailValidated === true)}
                    offset={20}
                    position="right center"
                  /><br />
                </div>
                <RaisedButton label="Continue" primary={true} onClick={this.handleEmailContinue} />
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
