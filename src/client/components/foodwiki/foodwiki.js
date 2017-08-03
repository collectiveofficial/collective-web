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
              Thanks for checking out our food wiki page! We are currently building it to be a fantastic resource for anyone to look up instructions on recipes, food preparation, and storage. We will keep you updated on when this is fully functional. But, for now, check out these links which can provide decent resources about any food related questions you may have.
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default foodwiki;
