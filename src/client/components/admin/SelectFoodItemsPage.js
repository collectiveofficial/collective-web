import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Header } from 'semantic-ui-react';

const SelectFoodItemsPage = (props) => {

  const styles = {
    root: {
      // display: 'flex',
      // flexWrap: 'wrap',
      display: 'flex',
      'flex-flow': 'row',
      // justifyContent: 'space-around',
    },
    gridList: {
      width: '80%',
      height: '50%',
      overflowY: 'auto',
    },
    addNewItem: {
      display: 'flex',
      'flex-flow': 'row',
    },
  };

  return (
    <div>
      <div style={styles.addNewItem}>
        <Subheader style={styles.addNewItem} >Add New Item</Subheader>
        <TextField
          style={styles.addNewItem}
          type="text"
          floatingLabelText="Item"
          floatingLabelFixed={true}
          // style={styles.field}
          // onChange={(event) => this.props.setZipcode(event.target.value)}
          // errorText={this.props.isZipcodeEmpty ? 'Zip code is required' : ''}
        /><br />
        <TextField
          style={styles.addNewItem}
          type="text"
          floatingLabelText="Image URL"
          floatingLabelFixed={true}
          // style={styles.field}
          // onChange={(event) => this.props.setZipcode(event.target.value)}
          // errorText={this.props.isZipcodeEmpty ? 'Zip code is required' : ''}
        /><br />
        <RaisedButton style={styles.addNewItem} label="Add Item" primary={true} /><br /><br />
      </div>
      <div style={styles.root}>
        <GridList
          style={styles.gridList}
          cols={3}
        >
          <Subheader>Select from Previous Items</Subheader>
          {props.adminReducers.foodItems.map(foodItem => (
            <GridTile
              key={foodItem.imageUrl}
              title={foodItem.foodName}
              actionIcon={<IconButton><CheckCircle color="rgb(30, 227, 91)" /></IconButton>}
            >
              <img src={foodItem.imageUrl} />
            </GridTile>
          ))}
        </GridList>
      </div>
    </div>
  );
};

export default SelectFoodItemsPage;
