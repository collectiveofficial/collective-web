import React, { Component } from 'react';
import { Icon, Message, Header } from 'semantic-ui-react';
import Orders from "./Orders.js";
import { connect } from 'react-redux';

const OrderInfo = props => {
  const styles = {
    headersAndTable: {
      margin: '0 2% 1% 2%',
    },
  };
  return (
    <div style={styles.headersAndTable}>
      <Header as="h2" icon>
        <Icon name="shopping basket" />
        Order Info
      </Header>
      {props.transactionHistory.length === 0 ?
        <Message color="yellow">If you recently ordered a package, please refresh your page to see the most recent order.</Message>
        :
        <div />
      }
      <Orders />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    // App Reducers
    transactionHistory: state.appReducer._transactionHistory,
  };
};

export default connect(mapStateToProps)(OrderInfo);
