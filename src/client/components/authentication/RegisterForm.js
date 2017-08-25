import React, { Component } from 'react';
var injectTapEventPlugin = require("react-tap-event-plugin");
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import s from './Register.css';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Modal, Message } from 'semantic-ui-react';
import schools from './universities_list.js';

injectTapEventPlugin();

const usStates = ['AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI',
'IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO',
'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA',
'PR','PW','RI','SC','SD','TN','TX','UT','VA','VI','VT','WA','WI',
'WV','WY'];

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
      state: '',
      zipCode: '',
      isFirstNameEmpty: false,
      isLastNameEmpty: false,
      isPhoneNumberEmpty: false,
      isBirthdayEmpty: false,
      isStreetAddressEmpty: false,
      isCityEmpty: false,
      isStateEmpty: false,
      isZipCodeEmpty: false,
      areThereEmptyFields: '',
      isInvalidState: false,
      isInvalidSchool: false,
      isFakeAddress: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.transferUserSignup = this.transferUserSignup.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
    this.areThereEmptyFields = this.areThereEmptyFields.bind(this);
  }

  componentDidMount() {
    console.log('register form is mounted');
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

  async areThereEmptyFields() {
    await this.setState({ isFirstNameEmpty: false });
    await this.setState({ isLastNameEmpty: false });
    await this.setState({ isPhoneNumberEmpty: false });
    await this.setState({ isBirthdayEmpty: false });
    await this.setState({ isStreetAddressEmpty: false });
    await this.setState({ isCityEmpty: false });
    await this.setState({ isStateEmpty: false });
    await this.setState({ isZipCodeEmpty: false });
    await this.setState({ isSchoolEmpty: false });
    await this.setState({ isInvalidState: false });
    await this.setState({ isInvalidSchool: false });
    await this.setState({ isFakeAddress: false });

    if (this.state.firstName.length === 0) {
      await this.setState({ isFirstNameEmpty: true });
    }
    if (this.state.lastName.length === 0) {
      await this.setState({ isLastNameEmpty: true });
    }
    if (this.state.phoneNumber.length === 0) {
      await this.setState({ isPhoneNumberEmpty: true });
    }
    if (this.state.birthday.length === 0) {
      await this.setState({ isBirthdayEmpty: true });
    }
    if (this.state.streetAddress.length === 0) {
      await this.setState({ isStreetAddressEmpty: true });
    }
    if (this.state.city.length === 0) {
      await this.setState({ isCityEmpty: true });
    }
    if (this.state.zipCode.length === 0) {
      await this.setState({ isZipCodeEmpty: true });
    }
    if (this.state.state.length === 0) {
      await this.setState({ isStateEmpty: true });
    }
    if (this.state.school.length === 0) {
      await this.setState({ isSchoolEmpty: true });
    }
    if (usStates.indexOf(this.state.state) < 0) {
      await this.setState({ isInvalidState: true });
    }
    if (schools.universities.indexOf(this.state.school) < 0) {
      await this.setState({ isInvalidSchool: true });
    }

    await this.setState({ areThereEmptyFields: this.state.isFirstNameEmpty ||
      this.state.isLastNameEmpty || this.state.isPhoneNumberEmpty ||
      this.state.isBirthdayEmpty || this.state.isStreetAddressEmpty ||
      this.state.isCityEmpty || this.state.isStateEmpty || this.state.isZipCodeEmpty
      || this.state.isStateEmpty || this.state.isInvalidState ||
      this.state.isSchoolEmpty || this.state.isInvalidSchool });
  }

  async submitUserInfo() {
    await this.areThereEmptyFields();
    if (this.state.areThereEmptyFields === false) {
      const response = await fetch('/auth/register-form/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNumber: this.state.phoneNumber,
          birthday: this.state.birthday,
          streetAddress: this.state.streetAddress,
          aptSuite: this.state.aptSuite,
          city: this.state.city,
          state: this.state.state,
          zipCode: this.state.zipCode,
          school: this.state.school,
          firebaseAccessToken: this.props.firebaseAccessToken,
        }),
      })
      const responseData = await response.json();
      if (responseData.userSignedUp) {
        await this.props.authorizeUser();
      } else {
        this.setState({ isFakeAddress: true });
      }
    }
  }

  render() {
    const styles = {
      field: {
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
          style={styles.field}
          onChange={(event) => this.setState({ firstName: event.target.value })}
          errorText={this.state.isFirstNameEmpty ? 'First name is required' : ''}
        /><br />
        <TextField
          type='text'
          value={this.state.lastName}
          floatingLabelText="Last Name"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={(event) => this.setState({ lastName: event.target.value })}
          errorText={this.state.isLastNameEmpty ? 'Last name is required' : ''}
        /><br />
        <AutoComplete
          searchText={this.state.school}
          onUpdateInput={school => this.setState({ school })}
          floatingLabelText="School"
          floatingLabelFixed={true}
          dataSource={schools.universities}
          filter={AutoComplete.fuzzyFilter}
          style={styles.field}
          openOnFocus={true}
          errorText={this.state.isSchoolEmpty ? 'School is required' : this.state.isInvalidSchool ? 'Please select a school from this list.' : ''}
        /><br />
        <TextField
         type='date'
         floatingLabelText="Date of Birth"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ birthday: event.target.value })}
         errorText={this.state.isBirthdayEmpty ? 'Birthday is required' : ''}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Cell Phone"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ phoneNumber: event.target.value })}
         errorText={this.state.isPhoneNumberEmpty ? 'Phone number is required' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Street Address"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ streetAddress: event.target.value })}
         errorText={this.state.isStreetAddressEmpty ? 'Street address is required' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Apt #/Suite"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ aptSuite: event.target.value })}
        /><br />
        <TextField
         type='text'
         floatingLabelText="City"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ city: event.target.value })}
         errorText={this.state.isCityEmpty ? 'City is required' : ''}
        /><br />
        <AutoComplete
          searchText={this.state.state}
          onUpdateInput={state => this.setState({ state: state.toUpperCase() })}
          floatingLabelText="State"
          floatingLabelFixed={true}
          dataSource={usStates}
          filter={AutoComplete.fuzzyFilter}
          style={styles.field}
          openOnFocus={true}
          errorText={this.state.isStateEmpty ? 'State is required' : this.state.isInvalidState ? 'Must be a valid US state abbreviation' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Zip Code"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.setState({ zipCode: event.target.value })}
         errorText={this.state.isZipCodeEmpty ? 'Zip code is required' : ''}
        /><br />
       <div>
         <RaisedButton label="Submit" primary={true} onTouchTap={this.areThereEmptyFields} /><br /><br />
         <Modal open={this.state.areThereEmptyFields === false}>
           <Modal.Content>
             <p>By clicking continue I have read and agreed to Collective's <Link to="terms">terms of use</Link> and <Link to="privacy">privacy policy</Link> as well as Best Food Forward's <Link to="bff">terms of use</Link>, and I agree to not hold any involved individuals or entities liable for anything related to the use, consumption, storage, or purchasing of food within this site.</p>
             {this.state.isFakeAddress ?
               <Message
                 error
                 header="Please enter a valid address"
               />
               :
               <div></div>
             }
           </Modal.Content>
           <Modal.Actions>
             <RaisedButton label="Cancel" secondary={true} onTouchTap={() => { this.setState({ areThereEmptyFields: '' }); }} />
             <RaisedButton label="Continue" primary={true} onTouchTap={this.submitUserInfo} /><br /><br />
           </Modal.Actions>
         </Modal>
      </div>
      </form>
    );
  }
}

export default RegisterForm;
