import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Register.css';
import Input from 'react-toolbox/lib/input';




class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      passwordInput: '',
      passwordRepeat: '',
      photoURL: '',
      facebookData: '',
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
      <form onSubmit={this.handleSubmit}>
        <Input
          type='text'
          label='First Name'
          name='name'
          value={this.state.firstName}
          onChange={(firstName) => this.setState({firstName})}
        />
        <Input
          type='text'
          label='Last Name'
          name='name'
          value={this.state.lastName}
          onChange={(lastName) => this.setState({lastName})}
        />
       <Input
          type='email'
          label='Email address'
          onChange={(emailInput) => this.setState({emailInput})}
          value={this.state.emailInput}
        />
        <Input
         type='tel'
         label='Cell phone'
         name='phone'
         onChange={(phoneNumber) => this.setState({phoneNumber})}
         value={this.state.phoneNumber}
        />
        <Input
         type='password'
         label='Password'
         onChange={(passwordInput) => this.setState({passwordInput})}
         value={this.state.passwordInput}
        />
        <Input
          type='password'
          label='Repeat Password'
          onChange={(passwordInput) => this.setState({passwordRepeat})}
          value={this.state.passwordRepeat}
         />
       <div>
        <Link to="/payment"><input type="submit" value="Submit" className={s.submit}/></Link>
      </div>
      </form>
    );
  }
}

export default RegisterForm;
