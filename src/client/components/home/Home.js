import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import Modal from 'react-modal';

import s from './Home.css';

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



class Voting extends React.Component {
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
      console.log('test')
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
        <div>
          <div className={s.cont}>
              <a className={s.link} onClick={() => {this.openModal()}}>Vote</a>
              <div>
                  <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      contentLabel="Example Modal">
                      <div className={s.flexcontainer}>
                        {this.props.items.map((x) => (
                          <div className={s.ballot}>
                            <img src={foodMaster[x.split(' ').join('')]}></img>
                            <div>{x}</div>
                          </div>
                      ))}
                      </div>
                      </Modal>
              </div>
          </div>
        </div>
      )
  }
}

// style={{overlay : {position: 'fixed', top: 600, left: 600, right: 600, bottom: 600,
//     backgroundColor: '#888888'}, content : {position: 'absolute', top: '40px', left: '40px',
//     right: '40px', bottom: '40px', border: '1px solid #ccc', background: '#fff', overflow: 'auto',
//     WebkitOverflowScrolling: 'touch', borderRadius: '4px', outline: 'none', padding: '20px'}}}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "2 September 2017",
      items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
      provider: "DNO Produce",
      //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
      location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university"
    };
  };
  render() {
    return (
      <div>
        <Header />
        <div className={s.root}>
          <div className={s.container}>
            <h1 className={s.banner}>Upcoming Bulk Buys</h1>
            <div className={s.card}>
              <h2 className={s.date}>{this.state.date}</h2>
              <iframe
                className={s.map}
                src={this.state.location}
                ></iframe>
              <div className={s.links}>
                <Voting items={this.state.items}/>
                <Provider provider={this.state.provider}/>
              </div>
            </div>
          </div>
        </div>
        <Footer />
    </div>
    );
  }
}

export default Home;
