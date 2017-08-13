import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Icon, Popup, List, Image } from 'semantic-ui-react';
import s from './Register.css';
import RegisterForm from './RegisterForm.js';
import { ref, firebaseAuth } from '../../config';
import { createNativeUser } from '../../utils/auth.js';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      userAllowedContinue: false,
      isPasswordValidated: '',
      userWantsEmailSignup: false,
      facebookData: '',
      isInvalidEmail: '',
      isWeakPassword: '',
      isEmailAlreadyInUse: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.handleFBSignUp = this.handleFBSignUp.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
  }

  async createNativeUser (email, pw) {
    await this.setState({ hasFirebaseChecked: true });
    return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid-email') {
        this.setState({ isInvalidEmail: true });
      } else {
        this.setState({ isInvalidEmail: false });
      }
      if (errorCode === 'auth/email-already-in-use') {
        this.setState({ isEmailAlreadyInUse: true });
      } else {
        this.setState({ isEmailAlreadyInUse: false });
      }
      if (errorCode === 'auth/weak-password') {
        this.setState({ isWeakPassword: true });
      } else {
        this.setState({ isWeakPassword: false });
      }
      console.log(error);
    });
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

  resetErrorStates() {
    this.setState({ isPasswordValidated: '' });
    this.setState({ isInvalidEmail: '' });
    this.setState({ isEmailAlreadyInUse: '' });
  }

  async handleEmailContinue() {
    await this.resetErrorStates();
    await this.validatePassword();
    if (this.state.isPasswordValidated) {
      await this.createNativeUser(this.state.emailInput, this.state.passwordInput);
    }
    const isValidLogin = !(this.state.isInvalidEmail || this.state.isEmailAlreadyInUse);
    if (isValidLogin && this.state.isPasswordValidated) {
      console.log('this.state.isEmailAlreadyInUse; ', this.state.isEmailAlreadyInUse);
      await this.setState({ userWantsEmailSignup: true });
      await this.setState({ userAllowedContinue: true });
    }
  }

  async handleFBSignUp() {
    const provider = await new firebaseAuth.FacebookAuthProvider();
    await provider.addScope('email, public_profile, user_friends');
    const result = await firebaseAuth().signInWithPopup(provider);
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
    await console.log(responseData);
    await this.setState({ facebookData: responseData.facebook_payload }, () => {
      console.log('this.state.facebookData: ', this.state.facebookData);
    });
    await this.setState({ userAllowedContinue: true });
    const idToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
    const firebaseResponse = await fetch('/auth/basic/home', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        idToken,
      }),
    });
    const firebaseResponseData = await firebaseResponse.json();
    console.log('responseData: ', firebaseResponseData);
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
              />
              :
              <div>
                <img
                  src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2 className={s.head}>Welcome to Collective</h2>
                <div>
                  {this.state.isEmailAlreadyInUse === true ?
                    <div>
                    <MailOutline />
                    <Popup
                      trigger={<TextField
                        type="email"
                        hintText="Email"
                        style={styles.iconStyles}
                        onChange={(event) => this.setState({ emailInput: event.target.value }, () => {console.log(this.state.emailInput)})}
                      />
                    }
                    content="This email is already in use"
                    open={this.state.isEmailAlreadyInUse === true}
                    offset={20}
                    position="right center"
                    /><br />
                    </div>
                    :
                    <div>
                    <MailOutline />
                    <Popup
                      trigger={
                        <TextField
                          type="email"
                          hintText="Email"
                          style={styles.iconStyles}
                          onChange={(event) => this.setState({ emailInput: event.target.value }, () => {console.log(this.state.emailInput)})}
                        />
                    }
                      content="Hmm...that doesn't look like an email address."
                      open={this.state.isInvalidEmail === true}
                      offset={20}
                      position="right center"
                    /><br />
                  </div>
                  }
                  {this.state.isWeakPassword ?
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
                        content="The password is too weak."
                        open={(this.state.isWeakPassword === true && this.state.isInvalidEmail === false && this.state.isEmailAlreadyInUse === false)}
                        offset={20}
                        position="right center"
                      /><br />
                    </div>
                    :
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
                      content="Your password needs a minimum of 8 characters with at least one uppercase letter, one lowercase letter and one number."
                      open={(this.state.isPasswordValidated === false)}
                      // open={(this.state.isPasswordValidated === false && this.state.isInvalidEmail === false && this.state.isEmailAlreadyInUse === false)}
                      offset={20}
                      position="right center"
                    /><br />
                  </div>
                  }
                </div>
                <br />
                <RaisedButton label="Continue" primary={true} onClick={this.handleEmailContinue} /><br /><br />
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
        <div className={s.shoot}>
          <div className={s.flexcontainer}>
              <div className={s.card}>
                <h2 className={s.head}>How it works</h2>
                <List>
                  <List.Item>
                    <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17807497_1005883922845608_8912956886368631568_o.jpg?oh=6f07d42171594a4f73740bceee2962b7&oe=59EADBED' />
                    <List.Content>
                      <List.Header>Vote</List.Header>
                      <List.Description>You vote and pay for the food you want</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
                <List>
                  <List.Item>
                    <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17854651_1005883912845609_4293592665208382319_o.jpg?oh=f0353b293d6f89d1b233eb0cc6e02a1a&oe=59EBC6F0' />
                    <List.Content>
                      <List.Header>Organize</List.Header>
                      <List.Description>We compile votes, pool money, and then send everything back to independent organizers</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
                <List>
                  <List.Item>
                    <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17855598_1005883899512277_3945066174219173922_o.jpg?oh=5a1f7d848a4efb9510a036481493bbf5&oe=59F30798' />
                    <List.Content>
                      <List.Header>Source</List.Header>
                      <List.Description>Organizing groups buy the food directly from local sources</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
                <List>
                  <List.Item>
                    <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17880057_1005883869512280_2672757500595292705_o.jpg?oh=d896a7760c7feae53fd6dac05e9403db&oe=59F61E1A' />
                    <List.Content>
                      <List.Header>Community</List.Header>
                      <List.Description>And then we work together to bring the bulk food to you, all for around half the cost of the grocery store</List.Description>
                    </List.Content>
                  </List.Item>
                </List>
              </div>
              <div className={s.card}>
                <h2 className={s.head}>Why it works</h2>
                <div className={s.infoCont}>
                  <div className={s.info}>Our current food system relies on an inefficient supply chain that continually adds unnecessary costs to the food you end up buying. On top of that, grocery stores have become wasteful and inefficient. Even though you buy the same 30-40 products every single time you go to the store, you have to pay extra just to support the 10,000 other products that you have no interest in. And because grocery stores have to bet on what consumers are going to buy, they end up having to throw out billions of pounds of unbought food each year. By cutting out the middle man, and only providing the most ripe and healthy food, we ensure that our users are able to eat healthy for very little cost all while contributing to a more sustainable, low-waste food system.</div>
                  <Image src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/16903508_967218336712167_6955343875042505956_o.jpg?oh=f1b88e47f83a5057fdb658ca16886ff0&oe=59F4D68C' />
                </div>
              </div>
              <div className={s.card}>
                <h2 className={s.head}>Why we're better</h2>
                <div className={s.infoCont}>
                  <Image src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/16807682_967218430045491_416372380349568596_n.jpg?oh=4c57c19d4c56c50d55298730afd32828&oe=5A27F30F' />
                  <div className={s.info}>We understand that many users have tons of options for where they can buy their groceries, we are certain that Collective is the best way. We are low cost and low waste and we work to support community farms and food organizers rather than to take them over. All across the baord, you can see companies like Amazon, Whole Foods, and Wal-Mart, who are monopolizing the food industry by taking over farms and setting predatory prices. Not only can they not meet our low prices or our sustainability, they don't work to empower community food systems like our communal purchasing system does. So if you are concerned about sustainability, waste, community, Collective is the only way to go.</div>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}
export default SignUp;
