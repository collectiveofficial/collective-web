import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Register.css';


class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      passwordInput: '',
      photoURL: '',
      facebookData: '',
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

export default RegisterForm;
