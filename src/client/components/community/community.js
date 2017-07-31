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
            <h1 className={s.banner}>Community</h1>
            <div className={s.card}>
              Here is where we keep a pinterest like message board for food related topics, that sort of thing, newsletter, outreach
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default community;
