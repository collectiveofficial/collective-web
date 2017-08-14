import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './community.css';

class community extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.card}>
              Thanks for coming to our community page. Here we will give you a chance to connect with other bulk buyers: sharing recipes, organizing meetups, and setting up events built around food. We will keep you updated as we improve the site and make this the section that you want it to be.
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default community;
