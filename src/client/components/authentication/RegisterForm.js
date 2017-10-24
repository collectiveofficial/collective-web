import React, { Component } from 'react';
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

const usStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI',
  'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO',
  'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA',
  'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI',
  'WV', 'WY',
];

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.transferUserSignup = this.transferUserSignup.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
    this.areThereEmptyFields = this.areThereEmptyFields.bind(this);
  }

  componentWillMount() {
    this.props.enterRegisterPage();
  }

  componentDidMount() {
    this.transferUserSignup();
  }

  async transferUserSignup() {
    if (this.props.appReducers.userWantsEmailSignup) {
      this.props.setEmailInput(this.props.emailInput);
    } else {
      this.props.setEmailInput(this.props.appReducers.facebookData.email);
      this.props.setFirstName(this.props.appReducers.facebookData.first_name );
      this.props.setLastName(this.props.appReducers.facebookData.last_name );
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.props.setValue(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    alert('A name was submitted: ' + this.props.value);
  }

  async areThereEmptyFields() {
    await this.props.setIsFirstNameEmpty(this.props.firstName.length === 0);
    await this.props.setIsLastNameEmpty(this.props.lastName.length === 0);
    await this.props.setIsPhoneNumberEmpty(this.props.phoneNumber.length === 0);
    await this.props.setIsBirthdayEmpty(this.props.birthday.length === 0);
    await this.props.setIsStreetAddressEmpty(this.props.streetAddress.length === 0);
    await this.props.setIsCityEmpty(this.props.city.length === 0);
    await this.props.setIsStateEmpty(this.props.state.length === 0);
    await this.props.setIsZipCodeEmpty(this.props.zipCode.length === 0);
    await this.props.setIsInvalidState(usStates.indexOf(this.props.state) < 0);
    await this.props.setIsSchoolEmpty(this.props.school.length === 0);
    await this.props.setIsInvalidSchool(schools.universities.indexOf(this.props.school) < 0);
    await this.props.setAreThereEmptyFields(
      this.props.isFirstNameEmpty || this.props.isLastNameEmpty ||
      this.props.isPhoneNumberEmpty || this.props.isBirthdayEmpty ||
      this.props.isStreetAddressEmpty || this.props.isCityEmpty ||
      this.props.isStateEmpty || this.props.isZipCodeEmpty ||
      this.props.isInvalidState || this.props.isSchoolEmpty ||
      this.props.isInvalidSchool);
    //TODO REFACTOR ^^
  }

  async submitUserInfo() {
    await this.areThereEmptyFields();
    if (this.props.areThereEmptyFields === false) {
      const response = await fetch('/auth/register-form/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          firstName: this.props.firstName,
          lastName: this.props.lastName,
          // school: this.props.school,
          phoneNumber: this.props.phoneNumber,
          birthday: this.props.birthday,
          streetAddress: this.props.streetAddress,
          aptSuite: this.props.aptSuite,
          city: this.props.city,
          state: this.props.state,
          zipCode: this.props.zipCode,
          school: this.props.school,
          firebaseAccessToken: this.props.appReducers.firebaseAccessToken
        }),
      })
      const responseData = await response.json();
      if (responseData.userSignedUp) {
        await this.props.authorizeUser();
      } else {
        this.props.setIsFakeAddress(true);
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
          value={this.props.firstName}
          floatingLabelText="First Name"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={(event) => this.props.setFirstName(event.target.value)}
          errorText={this.props.isFirstNameEmpty ? 'First name is required' : ''}
        /><br />
        <TextField
          type='text'
          value={this.props.lastName}
          floatingLabelText="Last Name"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={(event) => this.props.setLastName(event.target.value)}
          errorText={this.props.isLastNameEmpty ? 'Last name is required' : ''}
        /><br />
        <AutoComplete
          searchText={this.props.school}
          onUpdateInput={school => this.props.setSchool(school)}
          floatingLabelText="School"
          floatingLabelFixed={true}
          dataSource={schools.universities}
          filter={AutoComplete.fuzzyFilter}
          style={styles.field}
          openOnFocus={true}
          errorText={this.props.isSchoolEmpty ? 'School is required' : this.props.isInvalidSchool ? 'Please select a school from this list.' : ''}
        /><br />
        <TextField
         type='date'
         floatingLabelText="Date of Birth"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setBirthday(event.target.value)}
         errorText={this.props.isBirthdayEmpty ? 'Birthday is required' : ''}
        /><br />
        <TextField
         type='tel'
         floatingLabelText="Cell Phone"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setPhoneNumber(event.target.value)}
         errorText={this.props.isPhoneNumberEmpty ? 'Phone number is required' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Street Address"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setStreetAddress(event.target.value)}
         errorText={this.props.isStreetAddressEmpty ? 'Street address is required' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Apt #/Suite"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setAptSuite(event.target.value)}
        /><br />
        <TextField
         type='text'
         floatingLabelText="City"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setCity(event.target.value)}
         errorText={this.props.isCityEmpty ? 'City is required' : ''}
        /><br />
        <AutoComplete
          searchText={this.props.state}
          onUpdateInput={state => this.props.setState(state.toUpperCase())}
          floatingLabelText="State"
          floatingLabelFixed={true}
          dataSource={usStates}
          filter={AutoComplete.fuzzyFilter}
          style={styles.field}
          openOnFocus={true}
          errorText={this.props.isStateEmpty ? 'State is required' : this.props.isInvalidState ? 'Must be a valid US state abbreviation' : ''}
        /><br />
        <TextField
         type='text'
         floatingLabelText="Zip Code"
         floatingLabelFixed={true}
         style={styles.field}
         onChange={(event) => this.props.setZipCode(event.target.value)}
         errorText={this.props.isZipCodeEmpty ? 'Zip code is required' : ''}
        /><br />
       <div>
         <RaisedButton label="Submit" primary={true} onTouchTap={this.areThereEmptyFields} /><br /><br />
         <Modal open={this.props.areThereEmptyFields === false}>
           <Modal.Content>
             <p>By clicking continue I have read and agreed to Collective's <Link to="terms">terms of use</Link> and <Link to="privacy">privacy policy</Link> as well as Best Food Forward's <Link to="bff">terms of use</Link>, and I agree to not hold any involved individuals or entities liable for anything related to the use, consumption, storage, or purchasing of food within this site.</p>
             {this.props.isFakeAddress ?
               <Message
                 error
                 header="Please enter a valid address"
               />
               :
               <div></div>
             }
           </Modal.Content>
           <Modal.Actions>
             <RaisedButton label="Cancel" secondary={true} onTouchTap={() => { this.props.setAreThereEmptyFields(''); }} />
             <RaisedButton label="Continue" primary={true} onTouchTap={this.submitUserInfo} /><br /><br />
           </Modal.Actions>
         </Modal>
      </div>
      </form>
    );
  }
}

export default RegisterForm;
