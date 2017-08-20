import React, { Component } from 'react';
import { Icon, Message, Header } from 'semantic-ui-react';
import Orders from "./Orders.js";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const styles = {
      headersAndTable: {
        margin: '0 2% 1% 2%',
      },
    };
    return (
      <div style={styles.headersAndTable}>
        <Header as="h2" icon>
          <Icon name="settings" />
          Account Settings
        </Header>
        {this.props.userTransactionHistory.length === 0 ?
          <Message color="yellow">If you recently ordered a package, please refresh your page to see the most recent order.</Message>
          :
          <div></div>
        }
        <Orders userTransactionHistory={this.props.userTransactionHistory} />
      </div>
    );
  }
}

export default Settings;
