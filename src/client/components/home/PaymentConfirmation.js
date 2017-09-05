import React, { Component } from 'react';
import {
  Redirect,
} from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Message } from 'semantic-ui-react'
import { connect } from 'react-redux';

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
        <Message color='green'>Thank you for voting! Your votes are now recorded. Your payment receipt has been sent to {this.props.paymentEmail}.</Message>
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

const mapStateToProps = (state, props) => {
  return {
    // Payment Reducers
    paymentEmail: state.paymentReducer._paymentEmail,
  }
};

const ConnectedPaymentConfirmation = connect(mapStateToProps)(PaymentConfirmation);

export default ConnectedPaymentConfirmation;
