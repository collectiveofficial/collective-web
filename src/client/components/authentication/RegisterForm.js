import React, { Component } from 'react';
var injectTapEventPlugin = require("react-tap-event-plugin");
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Register.css';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import schools from './universities_list.js';

injectTapEventPlugin();
const items = [
  <MenuItem key={1} value={1} primaryText="Never" />,
  <MenuItem key={2} value={2} primaryText="Every Night" />,
  <MenuItem key={3} value={3} primaryText="Weeknights" />,
  <MenuItem key={4} value={4} primaryText="Weekends" />,
  <MenuItem key={5} value={5} primaryText="Weekly" />,
];
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
      birthday: '',
      streetAddress: '',
      aptSuite: '',
      city: '',
      state: '',
      zipCode: '',
      schools: '',
      school: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTheChange = this.handleTheChange.bind(this);
  }

  componentWillMount() {
    const transformSchoolData = (school) => {
      const parantheses = /\(([^\)]+)\)/;
      const newlines = /\r?\n|\r/g;
      return school.replace(parantheses, '').replace(newlines, '').trim();
    };
    var xschools = schools.schools['universities'].map(transformSchoolData);
    this.setState({ schools: xschools });
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + this.state.value);
  }

  handleTheChange (event, index, value) {
    this.setState({ school: value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          type='text'
          // hintText='First Name'
          floatingLabelText="First Name"
          floatingLabelFixed={true}
          onChange={(event) => this.setState({ firstName: event.target.value })}
        /><br />
        <TextField
          type='text'
          // hintText='Last Name'
          floatingLabelText="Last Name"
          floatingLabelFixed={true}
          onChange={(event) => this.setState({ lastName: event.target.value })}
        /><br />
        <SelectField
          value={this.state.school}
          onChange={this.handleTheChange}
          floatingLabelText="School"
          // floatingLabelFixed={true}
          // hintText="Hint text"
        >
          {this.state.schools.map((school, key) => {
            return <MenuItem key={key} value={school} primaryText={school} />
          })}
          {/* <MenuItem key={1} value={1} primaryText="Never" />
          <MenuItem key={2} value={2} primaryText="Every Night" />
          <MenuItem key={3} value={3} primaryText="Weeknights" />
          <MenuItem key={4} value={4} primaryText="Weekends" />
          <MenuItem key={5} value={5} primaryText="Weekly" /> */}
        </SelectField>
        <br />
        <TextField
         type='date'
         floatingLabelText="Date of Birth"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ birthday: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Cell Phone"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ phoneNumber: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Street Address"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ streetAddress: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Apt #/Suite"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ aptSuite: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="City"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ city: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="State"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ state: event.target.value })}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Zip Code"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ zipCode: event.target.value })}
        /><br />
       <div>
        <Link to="/payment"><input type="submit" value="Submit" className={s.submit}/></Link>
      </div>
      </form>
    );
  }
}

export default RegisterForm;
