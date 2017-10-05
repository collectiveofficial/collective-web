import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Cancel from 'material-ui/svg-icons/navigation/cancel';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Header, Message } from 'semantic-ui-react';
import _ from 'lodash';

const SelectFoodItemsPage = (props) => {

  const styles = {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      // justifyContent: 'space-around',
      // margin: '1% 40% 1% 0',
    },
    gridList: {
      width: '80%',
      height: '50%',
      overflowY: 'auto',
    },
    addNewItem: {

    },
  };

  return (
    <div>
      {props.adminReducers.selectedFoodItems.length > 0 ?
        <div>
          <Subheader>Number of Items Selected: {props.adminReducers.selectedFoodItems.length}</Subheader>
          <Subheader>Selected Items</Subheader>
        </div>
        :
        <Message color='blue'>Please add new items by selecting from previous items or inputting new items</Message>
      }
      <div style={styles.root}>
        <GridList
          style={styles.gridList}
          cols={3}
        >
          {props.adminReducers.selectedFoodItems.map(foodItem => (
            <GridTile
              key={foodItem.imageUrl}
              title={foodItem.name}
              actionIcon={
                <IconButton>
                  <Cancel
                    color="rgb(162, 153, 158)"
                    onClick={() => {
                    props.setSelectedFoodItems(props.adminReducers.selectedFoodItems, { name: foodItem.name, imageUrl: foodItem.imageUrl });
                  }}
                  />
                </IconButton>}
            >
              <img src={foodItem.imageUrl} />
            </GridTile>
          ))}
        </GridList>
      </div>
      <Subheader>Add New Item</Subheader>
      <div style={styles.addNewItem}>
        <TextField
          style={styles.addNewItem}
          type="text"
          floatingLabelText="Item"
          floatingLabelFixed={true}
          // style={styles.field}
          onChange={event => props.setNewItem(event.target.value)}
          // errorText={this.props.isZipcodeEmpty ? 'Zip code is required' : ''}
        /><br />
        <TextField
          style={styles.addNewItem}
          type="text"
          floatingLabelText="Image URL"
          floatingLabelFixed={true}
          // style={styles.field}
          onChange={event => props.setNewImageUrl(event.target.value)}
          // errorText={this.props.isZipcodeEmpty ? 'Zip code is required' : ''}
        /><br />
        <RaisedButton style={styles.addNewItem} label="Add Item" primary={true} onClick={() => { props.setSelectedFoodItems(props.adminReducers.selectedFoodItems, { name: props.adminReducers.newItem, imageUrl: props.adminReducers.newImageUrl }); }} /><br /><br />
      </div>
      <div>Or</div>
      <Subheader>Select from Previous Items</Subheader>
      <div style={styles.root}>
        <GridList
          style={styles.gridList}
          cols={3}
        >
          {props.adminReducers.foodItems.map(foodItem => (
            <GridTile
              key={foodItem.imageUrl}
              title={foodItem.name}
              actionIcon={
                <IconButton>
                  <CheckCircle
                    color={_.some(props.adminReducers.selectedFoodItems, { name: foodItem.name }) ?
                    'rgb(30, 227, 91)'
                    :
                    'rgb(162, 153, 158)'
                  }
                  />
                </IconButton>}
              onClick={() => {
                props.setSelectedFoodItems(props.adminReducers.selectedFoodItems, { name: foodItem.name, imageUrl: foodItem.imageUrl });
              }}
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
