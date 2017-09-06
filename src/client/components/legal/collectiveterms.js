import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Legal.css';


class terms extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.container}>
        <iframe src="https://drive.google.com/file/d/0B72SnxgPvfVAdW5pbUhmVXptY00/preview" width="640" height="480"></iframe>
      </div>
    );
  }
}

export default terms;
