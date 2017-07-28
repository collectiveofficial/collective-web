import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './foodwiki.css';

class foodwiki extends Component {
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
            <h1 className={s.banner}>Food Wiki</h1>
            <div className={s.card}>
              Here is where we compile a database of recipes, storage intructions, etc., for all the produce we provide
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default foodwiki;
