import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: '',
      passwordInput: '',
      isPasswordValidated: '',
      isInvalidEmail: '',
      isWeakPassword: '',
      isEmailAlreadyInUse: '',
      isExistingUserFBAuth: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
    };
    this.handleEmailContinue = this.handleEmailContinue.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.createNativeUser = this.createNativeUser.bind(this);
    this.resetErrorStates = this.resetErrorStates.bind(this);
  }

  componentWillUnmount() {
    console.log('Signup is unmounted');
    console.log('this.state.isPasswordValidated', this.state.isPasswordValidated);
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
      // if (errorCode === 'auth/email-already-in-use') {
      //   this.setState({ isEmailAlreadyInUse: true });
      //   this.setState({ passwordErrorMessage: 'This email is already in use. Please log in or register with another email.' });
      // } else {
      //   this.setState({ isEmailAlreadyInUse: false });
      // }
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
    await console.log('handleEmailContinue is executing/executed');
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
          // const sendEmailVerification = await firebaseEmailSignUpUser.sendEmailVerification();
          // await console.log('sendEmailVerification successful.');
        }
        const isValidLogin = !(this.state.isInvalidEmail || this.state.isEmailAlreadyInUse);
        if (isValidLogin && this.state.isPasswordValidated) {
          firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
          await this.props.setFirebaseAccessTokenState(firebaseAccessToken);
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
          await this.props.setUserWantsEmailSignupState(true);
          await this.props.setRouteToRegisterFormState(true);
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
                emailInput={this.state.emailInput}
                passwordInput={this.state.passwordInput}
                facebookData={this.props.facebookData}
                firebaseAccessToken={this.props.firebaseAccessToken}
                userAuthorized={this.props.userAuthorized}
              />
              :
              <div>
                <img
                  src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/20770387_10203435278718905_5967924942940849831_n.jpg?oh=db3ccb9562c5b3b2744d2418fcbc8cd2&oe=5A34AF97"
                  alt="collective logo"
                  height="30"
                  width="30"
                />
                <h2 className={s.head}>Welcome to Collective</h2>
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
                <br />
                <RaisedButton label="Continue" primary={true} onClick={this.handleEmailContinue} /><br /><br />
                <button
                  className={s.loginBtn}
                  id="btn-social-login"
                  onClick={this.props.handleFacebookAuth}
                >
                  Continue with Facebook
                </button>
                {/* {this.props.userAuthorized ?
                  <Redirect to="/home" />
                  :
                  <div></div>
                } */}
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
