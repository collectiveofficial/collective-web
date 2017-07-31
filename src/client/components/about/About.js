import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './About.css';

class About extends Component {
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
            <h1 className={s.banner}>About us</h1>
            <div className={s.card}>
              Hey we wanna change things and this is how we do it
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default About;
