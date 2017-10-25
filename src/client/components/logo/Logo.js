import React from 'react';
import LogoName from './LogoName.js';
import styles from './Logo.css';

const Logo = () => (
  <div
    alt="collective logo"
    className={styles.logo}
  >
    <LogoName />
  </div>
);

export default Logo;
