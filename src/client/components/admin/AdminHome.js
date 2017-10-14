import React, { Component } from 'react';
import { Icon, Header, Table } from 'semantic-ui-react'

const AdminHome = (props) => {
  const styles = {
    home: {
      marginBottom: '1.5%',
    },
    header: {
      marginLeft: '36%',
    },
    table: {
      margin: '2% 0 2% 2%',
    },
  };
  // export to csv

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
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Voting Window</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Dorm Packages Ordered</Table.HeaderCell>
            <Table.HeaderCell>Cooking Packages Ordered</Table.HeaderCell>
            <Table.HeaderCell>Total Packages Ordered</Table.HeaderCell>
            <Table.HeaderCell>Total Participants</Table.HeaderCell>
            <Table.HeaderCell>Net Volume from Sales</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Export Summary</Table.HeaderCell>
            <Table.HeaderCell>Export Food Ballots</Table.HeaderCell>
            <Table.HeaderCell>Export Participant Data</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
            {props.adminReducers.adminData.map(data => (
              <Table.Row>
                <Table.Cell>{data.formattedIntendedPickupDateTimeStart} - {data.formattedIntendedPickupTimeEnd}</Table.Cell>
                <Table.Cell>{data.formattedVoteDateTimeBeg} - {data.formattedVoteDateTimeEnd}</Table.Cell>
                <Table.Cell>{data.location}</Table.Cell>
                <Table.Cell>{data.totalDormPackagesOrdered}</Table.Cell>
                <Table.Cell>{data.totalCookingPackagesOrdered}</Table.Cell>
                <Table.Cell>{data.totalDormPackagesOrdered + data.totalCookingPackagesOrdered}</Table.Cell>
                <Table.Cell>{data.totalParticipants}</Table.Cell>
                <Table.Cell>${data.netVolumeFromSalesAfterFees}</Table.Cell>
                <Table.Cell>{data.status}</Table.Cell>
                <Table.Cell>
                  <a onClick={async () => { await props.setDownloadFile(data.id, 'summary'); }} href="javascript:void(0)" target="_blank">
                    Export as CSV
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a onClick={() => { props.setDownloadFile(data.id, 'ballot'); }} href="javascript:void(0)" target="_blank">
                    Export as CSV
                  </a>
                </Table.Cell>
                <Table.Cell>
                  <a onClick={() => { props.setDownloadFile(data.id, 'participant'); }} href="javascript:void(0)" target="_blank">
                    Export as CSV
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default AdminHome;
