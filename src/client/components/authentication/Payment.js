import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import firebase from 'firebase';
import s from './Payment.css';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import TextField from 'material-ui/TextField';
import MailOutline from 'material-ui/svg-icons/communication/mail-outline';
import LockOutline from 'material-ui/svg-icons/action/lock-outline';
import RaisedButton from 'material-ui/RaisedButton';
import { Icon, Popup } from 'semantic-ui-react';
import { Dropdown } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';


const numOptions = [
  {text: "0", value: "0"},
  {text: "1", value: "1"},
  {text: "2", value: "2"},
  {text: "3", value: "3"},
  {text: "4", value: "4"},
  {text: "5", value: "5"},
  {text: "6", value: "6"},
  {text: "7", value: "7"}
];

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dorm: 0,
      cook: 0,
    };
    this.onToken = this.onToken.bind(this);
  }
  onToken(token) {
    fetch('/save-stripe-token', {
      method: 'POST',
      body: JSON.stringify(token),
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`);
      });
    });
  }
  render() {
    return(
        <div className={s.root}>
          <div className={s.container}>
            <div>
              <img
                src="https://previews.123rf.com/images/arbuzu/arbuzu1410/arbuzu141000209/32592691-Letter-C-eco-leaves-logo-icon-design-template-elements-Vector-color-sign--Stock-Vector.jpg"
                alt="collective logo"
                height="30"
                width="30"
              />
              <h2>Payment</h2>
              <span>
                I'd like {' '}
                <Dropdown inline options={numOptions}
                  defaultValue={numOptions[0].value}
                />
                dorm packages
              </span>
              <br />
              <br />
              <span>
                I'd like {' '}
                <Dropdown inline options={numOptions}
                  defaultValue={numOptions[0].value}
                />
                cooking packages
              </span>
              <br />
              <br />
              <div>Total = </div>
              <br />
              <StripeCheckout
                token={this.onToken}
                stripeKey="pk_test_o6trMS2lojkAKMM0HbRJ0tDI"
              />
            </div>
          </div>
        </div>
    )
  }
}

export default Payment;
