// @flow
import React, { Component } from 'react';
import {
  Redirect,
} from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import momentTZ from 'moment-timezone';

type Props = {
  adminReducers: {
    intendedPickupTimeStart: string,
    intendedPickupTimeEnd: string,
    voteDateTimeBeg: string,
    voteDateTimeEnd: string,
  },
  selectDashboardPage: (string) => void,
};

const AddBulkBuyConfirmation = (props: Props) => {
  const styles = {
    confirmation: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
    },
    returnHomeButton: {
      marginBottom: '2%',
    },
  };
  return (
    <div style={styles.confirmation}>
      <Message color="green">Thank you for adding a new bulk buy. The bulk buy is now scheduled for {momentTZ.tz(props.adminReducers.intendedPickupTimeStart, 'America/New_York').format('MM/DD/YYYY hh:mm A')} -  {momentTZ.tz(props.adminReducers.intendedPickupTimeEnd, 'America/New_York').format('hh:mm A')}.
        <br />
        Voting will begin on {momentTZ.tz(props.adminReducers.voteDateTimeBeg, 'America/New_York').format('MM/DD/YYYY hh:mm A')} and end on {momentTZ.tz(props.adminReducers.voteDateTimeEnd, 'America/New_York').format('MM/DD/YYYY hh:mm A')}.
      </Message>
      <Button
        positive
        onClick={() => { props.selectDashboardPage('home'); }}
        style={styles.returnHomeButton}
      >
        Return to Admin Home
      </Button>
    </div>
  );
};

export default AddBulkBuyConfirmation;
