import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Login.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';


// class LogIn extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }
//
//   render() {
//     return (
//       <div>
//         <h1>Fuck you johnny and fuck you too matt and you too person</h1>
//       </div>
//     );
//   }
// }

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
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
        <div>
        <input
             placeholder='email'
             onChangeText={(emailInput) => this.setState({emailInput})}
             value={this.state.emailInput}
             autoCapitalize='none'
           />
         </div>
         <div>
           <input
             secureTextEntry={true}
             placeholder='password'
             onChangeText={(passwordInput) => this.setState({passwordInput})}
             value={this.state.passwordInput}
             autoCapitalize='none'
           />
         </div>
        <input type="submit" value="Submit" className={s.submit}/>
      </form>
    );
  }
}



class Login extends React.Component {
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
            <h1>Login</h1>
            <LoginForm />
            <button
              className={s.loginBtn}
              id         = "btn-social-login"
              whenClicked = {this.handleFBLogin}>
              Login with Facebook
            </button>
          </div>
        </div>
        <Footer />
    </div>
    );
  }
}


export default Login;
