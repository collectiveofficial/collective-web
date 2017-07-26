import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Modal from 'react-modal';
import s from './Home.css';

class Provider extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
}
    openModal() {
      this.setState({modalIsOpen: true});
    }
    afterOpenModal() {
      // references are now sync'd and can be accessed.
      // this.subtitle.style.color = '#f00';
    }
    closeModal() {
      this.setState({modalIsOpen: false});
    }
  render () {
      return (
          <div className={s.cont}>
              <a className={s.link} onClick={() => {this.openModal()}}>Provider Info</a>
              <div>
                  <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      contentLabel="Example Modal">
                      <div>
                        <h1>{this.props.provider}</h1>
                        Information about our awesome provider
                      </div>
                      </Modal>
              </div>
          </div>
      )
  }
}

export default Provider;
