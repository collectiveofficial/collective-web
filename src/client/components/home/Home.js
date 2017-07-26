import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Header from '../header/Header.js';
import Footer from '../footer/Footer.js';
import Modal from 'react-modal';
import s from './Home.css';
import Provider from './Provider.js';
import Voting from './Voting.js';

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
