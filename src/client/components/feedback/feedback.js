import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './feedback.css';

class feedback extends Component {
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
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdMJUSKNvto7jxcY800Z3ocrU7Hu7CSeu5B7M6s9ZJr7vGyzA/viewform?embedded=true" width="800" height="540" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
          </div>
        </div>
    </div>
    );
  }
}

export default feedback;
