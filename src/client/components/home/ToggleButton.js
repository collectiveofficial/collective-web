import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Modal from 'react-modal';
import s from './Home.css';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

const foodMaster = {Apples: "https://newenglandapples.files.wordpress.com/2014/10/img_5595.jpg",
Bananas: "https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?w=720",
Mangos: "http://www.multivu.com/players/English/72762525-MCI-eyes-revolution-mango-trade/gallery//image/b07adc25-5812-4dfd-aac3-3373579d586c.jpg",
SweetPotatoes: "https://i2.wp.com/bonnieplants.com/wp-content/uploads/2011/10/sweet-potatoes-harvest.jpg?ssl=1",
Pears: "http://www.canned-fresh.com/live/media/2012/02/pears2.jpg",
Potatoes: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
Kiwis: "http://cdn.thealternativedaily.com/wp-content/uploads/2013/11/kiwi.jpg",
Oranges: "http://grapplergourmet.com/wp-content/uploads/2015/03/piles.jpg",
Avocadoes: "http://jenknoedl.com/wp-content/uploads/2015/11/20150115-avocados-brown-1.jpg"
}

class ToggleButton extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
      condition: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({condition: !this.state.condition});
  }
  render() {
    return (
      <div onClick={this.handleClick} className={this.state.condition ? s.toggled: s.ballot}>
        <img src={foodMaster[this.props.food.split(' ').join('')]}></img>
        <div>{this.props.food}</div>
      </div>
    )
  }
}

export default ToggleButton;
