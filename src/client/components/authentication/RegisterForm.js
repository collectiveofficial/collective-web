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
import RaisedButton from 'material-ui/RaisedButton';
import schools from './universities_list.js';

injectTapEventPlugin();

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthday: '',
      streetAddress: '',
      aptSuite: '',
      city: '',
      state: null,
      zipCode: '',
      schools: '',
      school: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.transferUserSignup = this.transferUserSignup.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
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

  componentDidMount() {
    this.transferUserSignup();
  }

  async transferUserSignup() {
    if (this.props.userWantsEmailSignup) {
      await this.setState({ email: this.props.emailInput });
    } else {
      await this.setState({ email: this.props.facebookData.email });
      await this.setState({ firstName: this.props.facebookData.first_name });
      await this.setState({ lastName: this.props.facebookData.last_name });
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + this.state.value);
  }

  handleSchoolChange (event, index, value) {
    this.setState({ school: value });
  }

  handleStateChange (event, index, value) {
    this.setState({ state: value });
  }

  async submitUserInfo() {
    const response = await fetch('/auth/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        school: this.state.school,
        phoneNumber: this.state.phoneNumber,
        birthday: this.state.birthday,
        streetAddress: this.state.streetAddress,
        aptSuite: this.state.aptSuite,
        city: this.state.city,
        state: this.state.state,
        zipCode: this.state.zipCode,
      }),
    })
    const responseData = await response.json();
  }

  render() {
    const styles = {
      dropDown: {
        'text-align': 'left',
      },
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          type='text'
          value={this.state.firstName}
          floatingLabelText="First Name"
          floatingLabelFixed={true}
          onChange={(event) => this.setState({ firstName: event.target.value })}
        /><br />
        <TextField
          type='text'
          value={this.state.lastName}
          floatingLabelText="Last Name"
          floatingLabelFixed={true}
          onChange={(event) => this.setState({ lastName: event.target.value })}
        /><br />
        <TextField
          type='text'
          value={this.state.email}
          floatingLabelText="Email"
          floatingLabelFixed={true}
          onChange={(event) => this.setState({ email: event.target.value })}
        /><br />
        <SelectField
          type='text'
          value={this.state.school}
          onChange={this.handleSchoolChange}
          floatingLabelText="School"
          floatingLabelFixed={true}
          style={styles.dropDown}
        >
          {this.state.schools.map((school, key) => {
            return <MenuItem key={key} value={school} primaryText={school} />
          })}
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
         type='text'
         floatingLabelText="Street Address"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ streetAddress: event.target.value })}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Apt #/Suite"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ aptSuite: event.target.value })}
        /><br />
        <TextField
         type='text'
         floatingLabelText="City"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ city: event.target.value })}
        /><br />
        <SelectField
          type='text'
          value={this.state.state}
          onChange={this.handleStateChange}
          floatingLabelText="State"
          floatingLabelFixed={true}
          style={styles.dropDown}
        >
          {['AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI',
          'IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO',
          'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA',
          'PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI',
          'WV','WY'].map((state, key) => {
            return <MenuItem key={key} value={state} primaryText={state} />
          })}
        </SelectField><br />
        <TextField
         type='text'
         floatingLabelText="Zip Code"
         floatingLabelFixed={true}
         onChange={(event) => this.setState({ zipCode: event.target.value })}
        /><br />
       <div>
        <Link to="/payment"><RaisedButton label="Submit" secondary={true} onClick={this.submitUserInfo} /><br /><br />
        </Link>
      </div>
      </form>
    );
  }
}

export default RegisterForm;
