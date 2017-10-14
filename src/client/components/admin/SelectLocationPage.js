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
      <AdminMapContainer style={styles.map} />
      <div style={styles.cc}>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
    </div>
  );
};

export default SelectLocationPage;
