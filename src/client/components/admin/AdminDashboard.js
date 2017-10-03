import React, { Component } from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Grid } from 'semantic-ui-react';
import AdminHomeContainer from './AdminHomeContainer.js';
import BulkBuyContainer from './BulkBuyContainer.js';

const AdminDashboard = (props) => {
  // const styles = {
  // };
  let menuComponent;
  if (props.adminReducers.dashboardPageSelected === 'home') {
    menuComponent = <AdminHomeContainer />;
  }
  // else if (props.adminReducers.dashboardPageSelected === 'bulk buys') {
  //   menuComponent = <BulkBuyContainer />;
  // }
  return (
    <div>
      <Grid>
        <Grid.Column stetched width={2}>
          <Menu inverted vertical>
            <Menu.Item name='Home' active={props.adminReducers.dashboardPageSelected === 'home'} onClick={() => { props.selectDashboardPage('home'); }} />
            {/* <Menu.Item name='Add Bulk Buys' active={props.adminReducers.dashboardPageSelected === 'bulk buys'} onClick={() => { props.selectDashboardPage('bulk buys'); }} /> */}
          </Menu>
        </Grid.Column>
        <Grid.Column stetched width={12}>
          {menuComponent}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
