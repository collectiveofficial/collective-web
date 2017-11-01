import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import classnames from 'classnames';
import LogoName from '../logo/LogoName.js';
import s from './Header.css';

const Header = (props) => {
  const highlightButtons = classnames(s.link, {
    [s.highlight]: true,
  });
  return (
    <div className={s.root}>
      <Link to="/">
        <h1 className={s.logoName}>COLLECTIVE</h1>
      </Link>
      <div className={s.cont}>
        {props.appReducers.userAuthorized ?
          <div>
            {props.adminReducers.adminAuthorized === true ?
              <Link className={highlightButtons} to="/admin-dashboard/home">Admin Dashboard</Link>
              :
              <div></div>
            }
            <Link className={highlightButtons} to="/voting">Vote Now</Link>
            <Link className={s.link} to="/order-info">Order Info</Link>
          </div>
          :
          <div></div>
        }
        {/* <Link className={s.link} to="/about">About</Link> */}
        {/* <Link className={s.link} to="/faq">FAQ</Link> */}
        {/* <Link className={s.link} to="/foodwiki">FoodWiki</Link>
        <Link className={s.link} to="/community">Community</Link> */}
        {props.appReducers.authenticated ?
          <a
            className={s.link}
            onClick={() => {
              props.logOut();
              props.setAuthorizeAdmin(false);
            }}
            href="javascript:void(0)">
            Log Out
          </a>
          :
          <span>
            <Link className={highlightButtons} to="/login">Log In</Link>
            <Link className={highlightButtons} to="/signup">Sign Up</Link>
          </span>
        }
      </div>
    </div>
  );
}

export default Header;
