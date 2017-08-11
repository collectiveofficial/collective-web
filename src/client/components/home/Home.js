import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { Image, Modal } from 'semantic-ui-react';
import s from './Home.css';
import Voting from './Voting.js';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';


// style={{overlay : {position: 'fixed', top: 600, left: 600, right: 600, bottom: 600,
//     backgroundColor: '#888888'}, content : {position: 'absolute', top: '40px', left: '40px',
//     right: '40px', bottom: '40px', border: '1px solid #ccc', background: '#fff', overflow: 'auto',
//     WebkitOverflowScrolling: 'touch', borderRadius: '4px', outline: 'none', padding: '20px'}}}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "26 August 2017 from 9am to Noon",
      vote: "Voting window is from 21 August to 25 August",
      remainingCalendar: [
        ['9 September 2017',  "Voting window is from 27 August to 7 September"],
      ['23 September 2017',  "Voting window is from 10 September to 21 September"],
      ['7 October 2017',  "Voting window is from 24 September to 5 October"],
      ['28 October 2017',  "Voting window is from 8 October to 26 October"],
      ['10 November 2017', "Voting window is from 29 October to 8 November"],
      ['2 December 2017',  "Voting window is from 11 November to 30 November"]
      ],
      items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
      provider: "DNO Produce",
      //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
      location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university"
    };
  };
  render() {
    return (
      <div>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.headcont}>
              <div>
                <a href="https://hidden-reef-85880.herokuapp.com/" target="/blank">
                <img className={s.head} src='https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/15726586_926945357406132_4915279900008217763_n.jpg?oh=9ecd45f3cf6d31be1f7837c120853bd9&oe=5A046CFF'/>
              </a>
            </div>
            <Card style={{width: "800px", margin: "0 0 30px 0"}}>
              <CardTitle
                title={this.state.date}
                subtitle={this.state.vote}
              />
              <iframe
                className={s.map}
                src={this.state.location}
                ></iframe>
                <div className={s.links}>
                  <Link className={s.link} to="/voting">Vote and Pay</Link>
                  <Modal trigger={<div className={s.link}>Provider info</div>}>
                    <Modal.Header>{this.state.provider}</Modal.Header>
                    <Modal.Content image>
                      <Image wrapped size='medium' src='http://static1.squarespace.com/static/560d50c5e4b0f68fd092a78f/t/577cfee7893fc03a12adcedb/1495464043705/?format=1500w' />
                      <Modal.Description>
                        <p>DNO produce is a local food distributor committed to</p>
                        <p>providing high quality produce to Central Ohio restaurants</p>
                        <p>and stores. They do what they can to provide Ohio grown</p>
                        <p>produce and they have been instrumental in providing healthy food</p>
                        <p>for the Ohio State campus.</p>
                        <p>For more info, check em out <a href="http://dnoinc.com/" target="/blank">here.</a></p>
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                </div>
            </Card>
            {this.state.remainingCalendar.map((x, key) => (
              <Card style={{width: "800px", margin: "0 0 30px 0"}} key={key} >
                <CardTitle
                  title={x[0]}
                  subtitle={x[1]}
                />
              </Card>
            ))}
          </div>
        </div>
        {/* {this.props.userAuthorized ?
          <div></div>
          :
          <Redirect to="/login" />
        } */}
      </div>
    </div>
    );
  }
}

export default Home;
