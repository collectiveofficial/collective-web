// @flow
import React from 'react';
import {
  Route,
  Link,
} from 'react-router-dom';
import { Menu, Grid } from 'semantic-ui-react';
import AdminHomeContainer from './containers/AdminHomeContainer.js';
import BulkBuyContainer from './containers/BulkBuyContainer.js';
import s from './AdminDashboard.css';

type Props = {
  adminReducers: {
    dashboardPageSelected: string,
  },
  selectDashboardPage: (string) => void,
};

const AdminDashboard = (props: Props) => {
  // const styles = {
  // };
  let menuComponent;
  if (props.adminReducers.dashboardPageSelected === 'home') {
    menuComponent = <AdminHomeContainer />;
  } else if (props.adminReducers.dashboardPageSelected === 'bulk buys') {
    menuComponent = <BulkBuyContainer />;
  }
  return (
    <div>
      <Grid>
        <Grid.Column stetched width={2}>
          <Menu inverted vertical>
            <Menu.Item name='Home' active={props.adminReducers.dashboardPageSelected === 'home'} onClick={() => { props.selectDashboardPage('home'); }} />
            <Menu.Item name='Add Bulk Buys' active={props.adminReducers.dashboardPageSelected === 'bulk buys'} onClick={() => { props.selectDashboardPage('bulk buys'); }} />
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
