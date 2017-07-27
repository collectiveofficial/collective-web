import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Login.css';
import Input from 'react-toolbox/lib/input';


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
    event.preventDefault();
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={s.form}>
        <div className={s.back}>
          <Input
            type='email'
            label='Email address'
            onChange={(emailInput) => this.setState({emailInput})}
            value={this.state.emailInput}
          />
        </div>
        <div className={s.back}>
          <Input
            type='password'
            label='Password'
            onChange={(passwordInput) => this.setState({passwordInput})}
            value={this.state.passwordInput}
           />
         </div>
        <input type="submit" value="Submit" className={s.submit}/>
      </form>
    );
  }
}

export default LoginForm;
