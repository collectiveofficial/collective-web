import React, { Component } from 'react';
import { Icon, Message, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Orders from './Orders.js';
import s from './OrderInfo.css';

const OrderInfo = props => {
  const styles = {
    headersAndTable: {
      margin: '0 2% 1% 2%',
    },
  };
  return (
    <div className={s.root}>
      <div style={styles.headersAndTable}>
        <Header as="h2" icon>
          <Icon name="shopping basket" />
          Order Info
        </Header>
        {props.appReducers.transactionHistory.length === 0 ?
          <Message color="yellow">If you recently ordered a package, please refresh your page to see the most recent order.</Message>
          :
          <div />
        }
        <Orders />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    // App Reducers
    appReducers: state.appReducers,
    // transactionHistory: state.appReducer._transactionHistory,
  };
};

export default connect(mapStateToProps)(OrderInfo);
