import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Footer.css';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <span className={s.text}>Collective Technologies Inc.</span>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/home">Home</Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/terms">Terms of Use</Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/privacy">Privacy</Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/feedback">Feedback</Link>
          <span className={s.spacer}>·</span>
        </div>
      </div>
    );
  }
}

export default Footer;
