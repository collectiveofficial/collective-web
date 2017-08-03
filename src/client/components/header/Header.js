import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Header.css';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={s.root}>
          <Link className={s.brand, s.highlight} to="/">
            {/* <img src={require('./logo-small.png')} width="38" height="38" alt="React" /> */}
            <span className={s.brandTxt}>Collective</span>
          </Link>
          <div className={s.cont}>
            <Link className={s.link} to="/about">About</Link>
            <Link className={s.link} to="/foodwiki">FoodWiki</Link>
            <Link className={s.link} to="/community">Community</Link>
            {firebaseAuth().currentUser !== null ?
              <Link className={s.link} to="/login" onClick={this.props.logOut}>Log Out</Link>
              :
              <Link className={s.link} to="/login" onClick={this.props.showUser}>Log In</Link>
            }
            {/* <Link className={s.sign} to="/signup">Sign Up</Link> */}
          </div>
      </div>
    );
  }
}

export default Header;
