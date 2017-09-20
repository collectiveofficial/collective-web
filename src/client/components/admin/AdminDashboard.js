import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import AdminHome from './AdminHome.js';
import BulkBuy from './BulkBuy.js';

const AdminDashboard = (props) => {
  const styles = {
  };
  let menuComponent;
  if (props.dashboardPageSelected === 'home') {
    menuComponent = <AdminHome />;
  } else if (props.dashboardPageSelected === 'bulk buys') {
    menuComponent = <BulkBuy />;
  }
  return (
    <div>
      <div>
        <Sidebar.Pushable as={Segment}>
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
        </Sidebar.Pushable>
      </div>
    </div>
  );
};

export default AdminDashboard;
