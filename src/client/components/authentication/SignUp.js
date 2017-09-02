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
          firebaseAccessToken = await firebaseAuth().currentUser.getToken(/* forceRefresh */ true);
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
                <h2 className={s.head}>Why we''re better</h2> // TODO
                <div className={s.infoCont}>
                  <Image src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/16807682_967218430045491_416372380349568596_n.jpg?oh=4c57c19d4c56c50d55298730afd32828&oe=5A27F30F' />
                  <div className={s.info}>We understand that many users have tons of options for where they can buy their groceries, we are certain that Collective is the best way. We are low cost and low waste and we work to support community farms and food organizers rather than to take them over. All across the baord, you can see companies like Amazon, Whole Foods, and Wal-Mart, who are monopolizing the food industry by taking over farms and setting predatory prices. Not only can they not meet our low prices or our sustainability, they don''t work to empower community food systems like our communal purchasing system does. So if you are concerned about sustainability, waste, community, Collective is the only way to go.</div>
                </div>
              </div>
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
