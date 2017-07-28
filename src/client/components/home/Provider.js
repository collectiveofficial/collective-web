import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Modal from 'react-modal';
import s from './Home.css';
import Dialog from 'react-toolbox/lib/dialog';

class Provider extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
      active: false
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState({active: !this.state.active});
  }

  render () {
    return (
      <div>
        <a className={s.link} onClick={this.handleToggle}>Provider Info</a>
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title={this.props.provider}
        >
          <p>Info about DNO and their killer business.</p>
        </Dialog>
      </div>
    );
  }
}

export default Provider;
