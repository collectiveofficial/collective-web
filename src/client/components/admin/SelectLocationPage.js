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
import RaisedButton from 'material-ui/RaisedButton';
import { Header, Message } from 'semantic-ui-react';
import _ from 'lodash';

const SelectLocationPage = (props) => {
  return (
    <div>
      <Subheader>Add New Location</Subheader>
      <TextField
        type="text"
        floatingLabelText="Location"
        floatingLabelFixed={true}
        // style={styles.field}
        onChange={event => props.setNewLocation(event.target.value)}
        errorText={props.adminReducers.isValidAddress ? 'Please enter a valid address' : ''}
      /><br />
    </div>
  );
};

export default SelectLocationPage;
