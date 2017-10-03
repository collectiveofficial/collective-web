import React, { Component } from 'react';
import { Table, Header, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';

const Orders = props => (
  <div>
    <Header as="h3">
      Your Orders
    </Header>
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Bulk Buy Date</Table.HeaderCell>
          <Table.HeaderCell>Dorm Packages</Table.HeaderCell>
          <Table.HeaderCell>Cooking Packages</Table.HeaderCell>
          <Table.HeaderCell>Delivery</Table.HeaderCell>
          <Table.HeaderCell>Delivery Address (Dropoff at Door to Apartment/House)</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell>Date Purchased</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.transactionHistory.map((transaction) => {
          const dropoffDate = new Date(transaction.dropoffDate.substring(0, transaction.dropoffDate.indexOf('T')).split('-').join('/')).toDateString();
          const date = moment(transaction.date).format('LL');
          return (
            <Table.Row>
              <Table.Cell>{dropoffDate}</Table.Cell>
              <Table.Cell>{transaction.dormPackagesOrdered}</Table.Cell>
              <Table.Cell>{transaction.cookingPackagesOrdered}</Table.Cell>
              <Table.Cell>
                {transaction.isDelivery ?
                  <Icon name="checkmark" color="green" size="large" />
                  :
                  <div>---</div>
                }
              </Table.Cell>
              <Table.Cell>
                {transaction.deliveryAddress.length > 0 ?
                  <div>{transaction.deliveryAddress}</div>
                  :
                  <div>---</div>
                }
              </Table.Cell>

              <Table.Cell>${transaction.totalDollarAmount}</Table.Cell>
              <Table.Cell>{date}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </div>
);

const mapStateToProps = (state, props) => {
  return {
    // App Reducers
    transactionHistory: state.appReducer._transactionHistory,
  };
};

export default connect(mapStateToProps)(Orders);
