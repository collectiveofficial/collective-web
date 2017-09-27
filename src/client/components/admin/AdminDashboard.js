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
import BulkBuy from './BulkBuy.js';

const AdminDashboard = (props) => {
  console.log('hi');
  // const styles = {
  // };
  let menuComponent;
  if (props.adminReducers.dashboardPageSelected === 'home') {
    menuComponent = <AdminHomeContainer />;
  } else if (props.adminReducers.dashboardPageSelected === 'bulk buys') {
    menuComponent = <BulkBuy />;
  }
  return (
    <div>
      <Grid>
        <Grid.Column stetched width={2}>
          <Menu inverted vertical>
            <Menu.Item name='home' active={props.adminReducers.dashboardPageSelected === 'home'} onClick={() => { props.selectDashboardPage('home'); }} />
            <Menu.Item name='bulk buys' active={props.adminReducers.dashboardPageSelected === 'bulk buys'} onClick={() => { props.selectDashboardPage('bulk buys'); }} />
          </Menu>
        </Grid.Column>
        <Grid.Column stetched width={12}>
          {menuComponent}
        </Grid.Column>
      </Grid>

        {/* <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation="push" width="thin" visible={true} icon="labeled" vertical inverted>
            <Menu.Item name="home" onClick={() => { props.selectDashboardPage('home'); }}>
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item name="bulk buys" onClick={() => { props.selectDashboardPage('bulk buys'); }}>
              <Icon name="truck" />
              Add Bulk Buys
            </Menu.Item>
          </Sidebar>
        </Sidebar.Pushable> */}
        {/* <Sidebar.Pusher>
          {menuComponent}
        </Sidebar.Pusher> */}
        {/* <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation="push" width="thin" visible={true} icon="labeled" vertical inverted>
            <Menu.Item name="home" onClick={() => { props.adminReducers.selectDashboardPage('home'); }}>
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item name="bulk buys" onClick={() => { props.adminReducers.selectDashboardPage('bulk buys'); }}>
              <Icon name="truck" />
              Add Bulk Buys
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            {menuComponent}
          </Sidebar.Pusher>
        </Sidebar.Pushable> */}
    </div>
  );
};

export default AdminDashboard;
