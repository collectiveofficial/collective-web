import React, { Component } from 'react';
import { Table, Header, Icon } from 'semantic-ui-react';
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
            {this.props.userTransactionHistory.map((transaction) => {
              console.log('typeof transaction.date', typeof transaction.date);
              const dropoffDate = moment(transaction.dropoffDate).format('LL');
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

export default Orders;
