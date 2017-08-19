import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import s from './Home.css';
import { Card, Icon, Image, Checkbox, Popup, Dropdown, Feed, Modal, Header, Button } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react'
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';

class PaymentConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doesUserWantHome: false,
    };

  }

  render() {
    const styles = {
      returnHomeButton: {
        marginBottom: '2%',
      },
    };

    return (
      <div>
        <Message color='green'>Thank you for voting! Your votes are now recorded. Your payment receipt has been sent to {this.props.email}.</Message>
        <Button
          positive
          onTouchTap={() => { this.setState({ doesUserWantHome: true }); }}
          style={styles.returnHomeButton}
        >
          Return to Home
        </Button>
        {this.state.doesUserWantHome ?
          <Redirect to="/home" />
          :
          <div></div>
        }
      </div>
    )
  }
}

export default PaymentConfirmation;
