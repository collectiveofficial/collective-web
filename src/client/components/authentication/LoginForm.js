import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Login.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      emailInput: '',
      passwordInput: '',
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
             onChange={(emailInput) => this.setState({emailInput})}
             value={this.state.emailInput}
             type="text"
             autoCapitalize='none'
           />
         </div>
         <div>
           <input
             placeholder='password'
             onChange={(passwordInput) => this.setState({passwordInput})}
             value={this.state.passwordInput}
             type="text"
             autoCapitalize='none'
           />
         </div>
        <input type="submit" value="Submit" className={s.submit}/>
      </form>
    );
  }
}

export default LoginForm;
