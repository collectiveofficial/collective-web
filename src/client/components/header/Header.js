import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Header.css';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';
import { Button, Image, Modal } from 'semantic-ui-react';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={s.root}>
          <Link className={s.brand} to="/">
            <span className={s.brandTxt}>COLLECTIVE</span>
          </Link>
          <div className={s.cont}>
            {this.props.userAuthorized ?
              <div>
                <Link className={s.link, s.highlight} to="/voting">Vote Now</Link>
                <Link className={s.link} to="/order-info">Order Info</Link>
              </div>
              :
              <div></div>
            }
            <Link className={s.link} to="/about">About</Link>
            {/* <Link className={s.link} to="/foodwiki">FoodWiki</Link>
            <Link className={s.link} to="/community">Community</Link> */}
            {this.props.authenticated ?
              <a
                className={s.link}
                onClick={() => {
                  this.props.logOut();
                }}
                href="javascript:void(0)">
                Log Out
              </a>
              :
              <span>
                <Link className={s.link, s.highlight} to="/login" onClick={this.props.showUser}>Log In</Link>
                <Link className={s.link, s.highlight} to="/signup" onClick={this.props.showUser}>Sign Up</Link>
              </span>
            }
          </div>
      </div>
    );
  }
}

export default Header;
