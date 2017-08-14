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
      await this.setState({ userCredentialsValidated: true }, () => {
        console.log('user credentials validated: ', this.state.userCredentialsValidated);
      });
    }
  }

  async handleFBLogin() {
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
    // Need user authorization
    await this.setState({ facebookData: responseData.facebook_payload }, () => {
      console.log('this.state.facebookData: ', this.state.facebookData);
    });
    await this.setState({ userCredentialsValidated: true }, () => {
      console.log('user credentials validated: ', this.state.userCredentialsValidated);
    });
    const idToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    const firebaseResponse = await fetch('/auth/basic/home', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        idToken
      }),
    })
    const firebaseResponseData = await firebaseResponse.json();
    console.log('responseData: ', firebaseResponseData);
    // await this.logIn();
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
        {this.props.authenticated ?
          <div></div>
          :
          <div className={s.root}>
            <div className={s.container}>
              <img
                src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/20770387_10203435278718905_5967924942940849831_n.jpg?oh=db3ccb9562c5b3b2744d2418fcbc8cd2&oe=5A34AF97"
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
          <RaisedButton label="Log in" primary={true} onClick={this.handleEmailContinue} />
          {/* <LoginForm /> */}
          <div style={styles.or}>OR</div>
          <button
            className={s.loginBtn}
            id="btn-social-login"
            onClick={this.handleFBLogin}>
            Login with Facebook
          </button>
        </div>
      </div>
        }
    </div>
    );
  }
}


export default Login;
