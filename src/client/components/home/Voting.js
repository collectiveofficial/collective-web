import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Modal from 'react-modal';
import s from './Home.css';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import ToggleButton from './ToggleButton.js';

const foodMaster = {Apples: "https://newenglandapples.files.wordpress.com/2014/10/img_5595.jpg",
Bananas: "https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?w=720",
Mangos: "http://www.multivu.com/players/English/72762525-MCI-eyes-revolution-mango-trade/gallery//image/b07adc25-5812-4dfd-aac3-3373579d586c.jpg",
SweetPotatoes: "https://i2.wp.com/bonnieplants.com/wp-content/uploads/2011/10/sweet-potatoes-harvest.jpg?ssl=1",
Pears: "http://www.canned-fresh.com/live/media/2012/02/pears2.jpg",
Potatoes: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
Kiwis: "http://cdn.thealternativedaily.com/wp-content/uploads/2013/11/kiwi.jpg",
Oranges: "http://grapplergourmet.com/wp-content/uploads/2015/03/piles.jpg",
Avocadoes: "http://jenknoedl.com/wp-content/uploads/2015/11/20150115-avocados-brown-1.jpg"
}


class Voting extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
      modalIsOpen: false,
      items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes']
    };
    // this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
}
    // openModal() {
    //   console.log('test')
    //   this.setState({modalIsOpen: true});
    //   onClick={() => {this.openModal()}
    // }
    // afterOpenModal() {
    //   // references are now sync'd and can be accessed.
    //   // this.subtitle.style.color = '#f00';
    // }
    // closeModal() {
    //   this.setState({modalIsOpen: false});
    // }
    // handleClick() {
    //   this.setState({condition: !this.state.condition});
    // }
  render () {
      return (
        <div>
          <Header />
          <div className={s.cont}>
                  {/* <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      contentLabel="Example Modal">
                      <div className={s.flexcontainer}>
                        {this.props.items.map((x) => (
                          <ToggleButton food={x} />
                      ))}
                      </div>
                      </Modal> */}
                      <div className={s.flexcontainer}>
                        {this.state.items.map((x) => (
                          <ToggleButton food={x} />
                        ))}
                      </div>
              </div>
              <Footer />
          </div>
      )
  }
}

export default Voting;
