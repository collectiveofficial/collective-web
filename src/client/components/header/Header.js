import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Header.css';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={s.root}>
          <Link className={s.brand} to="/">
            {/* <img src={require('./logo-small.png')} width="38" height="38" alt="React" /> */}
            <span className={s.brandTxt}>COLLECTIVE</span>
          </Link>
          <div className={s.cont}>
            {/* <Modal trigger={<div className={s.link}>About</div>}>
              <Modal.Header>About Us</sModal.Header>
              <Modal.Content image>
                <Image wrapped size='medium' src='https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/17807302_1001695923264408_1104643144105822755_o.jpg?oh=848e9a20c09ef1a380e51414b70545e0&oe=59EFAC25' />
                <Modal.Description>
                  <Header>Collective makes healthy food easy</Header>
                  <p>We believe that the food system is too big, too inefficient, and too unsustainable to </p>
                  <p>feed people in the way they want. So we help to easily connect independent groups to local</p>
                  <p>sources, allowing consumers to empower themselves through high quality, cheap produce.</p>
                  <p></p>
                  <p>By cutting out the middleman and getting back to the community, we can provide</p>
                  <p>farmer's market quality at convenience store price.</p>
                  <p></p>
                  <p>You just buy into our $6 or $10 packages, and we help to give you a box full of amazing food.</p>
                </Modal.Description>
              </Modal.Content>
            </Modal> */}
            {/* <Modal trigger={<div className={s.link}>How it works</div>}>
              <Modal.Header>How it works</Modal.Header>
              <Modal.Content image>
                <Image wrapped size='medium' src='https://scontent-sjc2-1.xx.fbcdn.net/v/t31.0-8/20543885_10203394818707430_3468504837222731456_o.jpg?oh=9da059cb55b752e2440478a2df39293a&oe=5A2E7096' />
                <Modal.Description>
                  <Header>The whole process works in four easy steps</Header>
                  <p>1. You vote and pay for the food you want.</p>
                  <p></p>
                  <p>2. We compile votes, pool money from your group, and then send everything back</p>
                  <p>to independent organizers like Best Food Forward.</p>
                  <p></p>
                  <p>3. They buy the food directly from local sources</p>
                  <p></p>
                  <p>4. And then we work togetherto bring the bulk food to you, all for around half</p>
                  <p>the cost of the grocery store</p>
                </Modal.Description>
              </Modal.Content>
            </Modal> */}
            <Link className={s.link} to="/about">About</Link>
            <Link className={s.link} to="/foodwiki">FoodWiki</Link>
            <Link className={s.link} to="/community">Community</Link>
            {/* {firebaseAuth().currentUser !== null ? */}
            {this.props.authenticated ?
              <button
                className={s.link, s.highlight}
                onClick={() => {
                  this.props.logOut();
                }}
              >
                Log Out
              </button>
              :
              <span>
                <Link className={s.link, s.highlight} to="/login" onClick={this.props.showUser}>Log In</Link>
                <Link className={s.link, s.highlight} to="/signup" onClick={this.props.showUser}>Sign Up</Link>
              </span>
            }
          </div>
      </div>
    );
  }
}

export default Head;
