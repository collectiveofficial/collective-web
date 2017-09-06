import React, { Component } from 'react';
import { Table, Header, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.parseDateFromTimeZone = this.parseDateFromTimeZone.bind(this);
  }
  parseDateFromTimeZone(s) {
    return new Date(s.substring(0, s.indexOf('T')).split('-').join('/')).toDateString();
  }

  render() {
    return (
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
            {this.props.transactionHistory.map((transaction) => {
              console.log('typeof transaction.date', typeof transaction.date);
              const dropoffDate = this.parseDateFromTimeZone(transaction.dropoffDate);
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
  }
}

const mapStateToProps = (state, props) => {
  return {
    // App Reducers
    transactionHistory: state.appReducer._transactionHistory,
  }
};

const ConnectedOrders = connect(mapStateToProps)(Orders);

export default ConnectedOrders;
