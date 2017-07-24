import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Register.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      passwordInput: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
         <input
           value={this.state.firstName}
           placeholder='First Name'
           onChange={(firstName) => this.setState({firstName})}
           autoCapitalize='none'
           type="text"
         />
         <div>
         <input
           value={this.state.lastName}
           placeholder='Last Name'
           onChange={(lastName) => this.setState({lastName})}
           autoCapitalize='none'
           type="text"
         />
       </div>
       <div>
         <input
           value={this.state.email}
           placeholder='Email'
           onChange={(email) => this.setState({email})}
           autoCapitalize='none'
           type="email"
         />
       </div>
       <div>
         <input
           keyboardType='phone-pad'
           placeholder='(XXX)XXX-XXXX'
           onChange={(phoneNumber) => this.setState({phoneNumber})}
           value={this.state.phoneNumber}
           autoCapitalize='none'
         />
         <div>
         <input
          placeholder='password'
          onChange={(passwordInput) => this.setState({passwordInput})}
          value={this.state.passwordInput}
          autoCapitalize='none'
        />
      </div>
      <div>
        <input
          placeholder='repeat password'
          autoCapitalize='none'
        />
      </div>
       </div>
       <div>
        <input type="submit" value="Submit" className={s.submit}/>
      </div>
      </form>
    );
  }
}

class SignUp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      };
    }

    componentDidMount() {
      this.loadFbLoginApi();
    }

    loadFbLoginApi() {
      window.fbAsyncInit = function() {
      FB.init({
        appId      : '115864652385379',
        xfbml      : true,
        version    : 'v2.10'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.10&appId=115864652385379";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    }


      testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
        });
      }

      statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
          this.testAPI();
        } else if (response.status === 'not_authorized') {
            console.log("Please log into this app.");
        } else {
            console.log("Please log into this facebook.");
        }
      }

  checkLoginState() {
    FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
    }.bind(this));
  }

  handleFBLogin() {
    FB.login(this.checkLoginState());
  }

  render () {
    return (
      <div>
        <Header />
        <div className={s.root}>
          <div className={s.container}>
            <h1>Register</h1>
            <RegisterForm />
            <button
              className={s.loginBtn}
              id         = "btn-social-login"
              onClick = {this.handleFBLogin}>
              Sign up with Facebook
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default SignUp;
