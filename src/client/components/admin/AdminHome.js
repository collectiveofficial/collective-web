import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Table } from 'semantic-ui-react'

const AdminHome = (props) => {
  const styles = {
    home: {
      marginBottom: '1.5%',
    },
    header: {
      marginLeft: '32%'
    },
    table: {
      margin: '0 2% 0 10%',
      width: '70%',
    },
  };

  return (
    <div style={styles.home}>
      <Header as="h2" icon style={styles.header}>
        <Icon name="dashboard" />
        Admin Dashboard
        <Header.Subheader>
          Receive an overview of your bulk buys at Collective
        </Header.Subheader>
      </Header><br />
      <Table celled selectable style={styles.table}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>No Action</Table.Cell>
            <Table.Cell>None</Table.Cell>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>John</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jamie</Table.Cell>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>Requires call</Table.Cell>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>John</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Jill</Table.Cell>
            <Table.Cell>Denied</Table.Cell>
            <Table.Cell>None</Table.Cell>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>John</Table.Cell>
          </Table.Row>
          <Table.Row warning>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>No Action</Table.Cell>
            <Table.Cell>None</Table.Cell>
            <Table.Cell>John</Table.Cell>
            <Table.Cell>John</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default AdminHome;
