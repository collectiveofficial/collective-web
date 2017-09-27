import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './feedback.css';

const Feedback = () => {
  const styles = {
    googleForm: {
      width: 800,
      height: 540,
      frameBorder: 0,
      marginHeight: 0,
      marginWidth: 0,
    },
  }
  return (
    <div>
      <div className={s.root}>
        <div className={s.container}>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdMJUSKNvto7jxcY800Z3ocrU7Hu7CSeu5B7M6s9ZJr7vGyzA/viewform?embedded=true" style={styles.googleForm}>Loading...</iframe>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
