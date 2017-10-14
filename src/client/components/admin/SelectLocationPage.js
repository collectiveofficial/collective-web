import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Header, Message } from 'semantic-ui-react';
import AdminMapContainer from './containers/AdminMapContainer';

const SelectLocationPage = (props) => {
  const styles = {
    form: {
      margin: '0 0 0 35%',
    },
    field: {
      'text-align': 'left',
    },
    map: {
      display: 'flex',
    },
    addLocationButton: {
      margin: '2% 0 3% 38%'
    },
    cc: {
      display: 'none',
    }
  };

  const usStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI',
    'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO',
    'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA',
    'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI',
    'WV', 'WY',
  ];

  return (
    <div>
      {/* <div style={styles.form}>
        <Subheader>Select Location</Subheader>
        <TextField
          type="text"
          floatingLabelText="Street Address"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={event => props.setLocationStreetAddress(event.target.value)}
          errorText={props.adminReducers.isLocationStreetAddressEmpty ? 'Street address is required' : ''}
        /><br />
        <TextField
          type="text"
          floatingLabelText="Apt #/Suite"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={event => props.setLocationAptSuite(event.target.value)}
        /><br />
        <TextField
          type="text"
          floatingLabelText="City"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={event => props.setLocationCity(event.target.value)}
          errorText={props.adminReducers.isLocationCityEmpty ? 'City is required' : ''}
        /><br />
        <AutoComplete
          searchText={props.adminReducers.LocationState}
          onUpdateInput={state => props.setLocationState(state.toUpperCase())}
          floatingLabelText="State"
          floatingLabelFixed={true}
          dataSource={usStates}
          filter={AutoComplete.fuzzyFilter}
          style={styles.field}
          openOnFocus={true}
          errorText={props.adminReducers.isLocationStateEmpty ? 'State is required' : props.adminReducers.isInvalidLocationState ? 'Must be a valid US state abbreviation' : ''}
        /><br />
        <TextField
          type="text"
          floatingLabelText="Zip Code"
          floatingLabelFixed={true}
          style={styles.field}
          onChange={event => props.setLocationZipCode(event.target.value)}
          errorText={props.adminReducers.isLocationZipCodeEmpty ? 'Zip code is required' : ''}
        /><br />
      </div>
      <RaisedButton
        label="Add New Location"
        style={styles.addLocationButton}
        primary={true}
        onClick={async () => {
          const locationObj = {
            streetAddress: props.adminReducers.locationStreetAddress,
            city: props.adminReducers.locationCity,
            aptSuite: props.adminReducers.locationAptSuite,
            state: props.adminReducers.locationState,
            zipCode: props.adminReducers.locationZipCode,
          };
          await props.checkEmptyFields(locationObj);
          if (!props.adminReducers.areThereEmptyFields) {
            // await props.addNewLocation(locationObj);
          }
        }}
      /> */}
      {/* Add Google Maps multiple markers and listener to execute setting new location */}
      <AdminMapContainer style={styles.map} />
      <div style={styles.cc}>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
    </div>
  );
};

export default SelectLocationPage;
