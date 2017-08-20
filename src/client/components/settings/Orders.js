import React, { Component } from 'react';
import { Table, Header } from 'semantic-ui-react';
import moment from 'moment';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Dorm Packages</Table.HeaderCell>
              <Table.HeaderCell>Cooking Packages</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.userTransactionHistory.map((transaction) => {
              console.log('typeof transaction.date', typeof transaction.date);
              const date = moment(transaction.date).format('LL');
              return (
                <Table.Row>
                  <Table.Cell>{date}</Table.Cell>
                  <Table.Cell>{transaction.dormPackagesOrdered}</Table.Cell>
                  <Table.Cell>{transaction.cookingPackagesOrdered}</Table.Cell>
                  <Table.Cell>${transaction.totalDollarAmount}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Orders;
