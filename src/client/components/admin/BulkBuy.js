import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';
import moment from 'moment';
import InputMoment from 'input-moment';
import AdminHome from './AdminHome.js';
import BulkBuy from './BulkBuy.js';
import './admin.css';

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intendedPickupTimeStart: '',
      intendedPickupTimeEnd: '',
      voteDateTimeBeg: '',
      voteDateTimeEnd: '',
      foodItemsText: '',
      m: moment(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }


  handleChange() {
    this.setState({ m });
  };

  handleSave() {
    console.log('saved', this.state.m.format('llll'));
  };

  render() {
    const styles = {
      field: {
        textAlign: 'left',
      },
      bulkBuys: {
        marginLeft: '35%',
        marginBottom: '1.5%',
      },
      form: {
        marginLeft: '1%',
      },
      button: {
        marginLeft: '6%',
      },
    };
    return (
      <div style={styles.bulkBuys}>
        <Header as="h2" icon>
          <Icon name="truck" />
          Bulk Buys
          <Header.Subheader>
            Add new bulk buys for your members
          </Header.Subheader>
        </Header><br />
        <div style={styles.form}>
          <div className="app">
            <form>
              <div className="input">
                <input type="text" value={this.state.m.format('llll')} readOnly />
              </div>
              <InputMoment
                moment={this.state.m}
                onChange={this.handleChange}
                onSave={this.handleSave}
              />
            </form>
          </div>
          <TextField
            type="datetime-local"
            value={this.state.intendedPickupTimeStart}
            floatingLabelText="Starting Pickup Time"
            floatingLabelFixed={true}
            style={styles.field}
            onChange={(event) => this.setState({ intendedPickupTimeStart: event.target.value })}
            // errorText={this.state.isLastNameEmpty ? 'Last name is required' : ''}
          /><br />
          <TextField
            type="datetime-local"
            value={this.state.intendedPickupTimeEnd}
            floatingLabelText="Ending Pickup Time"
            floatingLabelFixed={true}
            style={styles.field}
            onChange={(event) => this.setState({ intendedPickupTimeEnd: event.target.value })}
            // errorText={this.state.isLastNameEmpty ? 'Last name is required' : ''}
          /><br />
          <TextField
            type="datetime-local"
            value={this.state.voteDateTimeBeg}
            floatingLabelText="Beginning Vote Time"
            floatingLabelFixed={true}
            style={styles.field}
            onChange={(event) => this.setState({ voteDateTimeBeg: event.target.value })}
            // errorText={this.state.isLastNameEmpty ? 'Last name is required' : ''}
          /><br />
          <TextField
            type="datetime-local"
            value={this.state.voteDateTimeEnd}
            floatingLabelText="Ending Vote Time"
            floatingLabelFixed={true}
            style={styles.field}
            onChange={(event) => this.setState({ voteDateTimeEnd: event.target.value })}
            // errorText={this.state.isLastNameEmpty ? 'Last name is required' : ''}
          /><br />
          <TextField
            type='text'
            value={this.state.foodItemsText}
            onChange={(event) => this.setState({ foodItemsText: event.target.value })}
            hintText="Spinach, Apples, Lettuce"
            floatingLabelText="Food Items, Limit 15 (seperated by a comma and a space)"
            multiLine={true}
            rows={3}
          /><br /><br />
          <Button positive style={styles.button}>Add Bulk Buy</Button>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
