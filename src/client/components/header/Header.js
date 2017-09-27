import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import s from './Header.css';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';
import { Button, Image, Modal } from 'semantic-ui-react';

const Header = (props) => (
  <div className={s.root}>
    <Link className={s.brand} to="/">
      <span className={s.brandTxt}>COLLECTIVE</span>
    </Link>
    <div className={s.cont}>
      {props.userAuthorized ?
        <div>
          {props.adminReducers.adminAuthorized === true ?
            <Link className={s.link, s.highlight} to="/admin-dashboard">Admin Dashboard</Link>
            :
            <div />
          }
          <Link className={s.link, s.highlight} to="/voting">Vote Now</Link>
          <Link className={s.link} to="/order-info">Order Info</Link>
        </div>
        :
        <div />
      }
      <Link className={s.link} to="/about">About</Link>
      {/* <Link className={s.link} to="/foodwiki">FoodWiki</Link>
      <Link className={s.link} to="/community">Community</Link> */}
      {props.authenticated ?
        <a
          className={s.link}
          onClick={() => {
            props.logOut();
          }}
          href="javascript:void(0)">
          Log Out
        </a>
        :
        <span>
          <Link className={s.link, s.highlight} to="/login" onClick={props.showUser}>Log In</Link>
          <Link className={s.link, s.highlight} to="/signup" onClick={props.showUser}>Sign Up</Link>
        </span>
      }
    </div>
  </div>
);

const mapStateToProps = (state) => {
  return {
    authenticated: state.appReducer._userAuthenticated, // TODO RENAME
    userAuthorized: state.appReducer._userAuthorized,
    adminReducers: state.adminReducers,
  }
};

export default connect(mapStateToProps)(Header);
