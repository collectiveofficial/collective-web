import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import { Image, Modal } from 'semantic-ui-react';
import s from './Home.css';
import Voting from './Voting.js';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Message } from 'semantic-ui-react'


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // date: "26 August 2017 from 9am to Noon",
      // vote: "Voting window is from 11 August at 12:00 AM to 23 August at 11:59 PM",
      // remainingCalendar: [
      //   ['9 September 2017',  "Voting window is from 24 August at 12:00 AM to 6 September at 11:59 PM"],
      pastDropoffDate: '26 August 2017 from 10 AM to 1 PM',
      date: '9 September 2017 from 9 AM to Noon',
      vote: "Voting window is from 24 August at 12:00 AM to 6 September at 11:59 PM",
      remainingCalendar: [
        ['23 September 2017',  "Voting window is from 7 September at 12:00 AM to 20 September at 11:59 PM"],
        ['7 October 2017',  "Voting window is from 21 September at 12:00 AM to 4 October at 11:59 PM"],
        ['28 October 2017',  "Voting window is from 5 October at 12:00 AM to 25 October at 11:59 PM"],
        ['10 November 2017', "Voting window is from 26 October at 12:00 AM to 8 November at 11:59 PM"],
        ['2 December 2017',  "Voting window is from 9 November at 12:00 AM to 29 November at 11:59 PM"]
      ],
      items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
      provider: "DNO Produce",
      //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
      location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university",
    };
  }

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
              <h1 className={s.banner}>Upcoming Bulk Buys</h1>
            </div>
            <Message color='blue'>Next pickup: {this.state.pastDropoffDate} at Scott House</Message>
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
                  <Modal trigger={<a className={s.link} href="javascript:void(0)">Provider info</a>} closeIcon="close">
                    <Modal.Header>{this.state.provider}</Modal.Header>
                    <Modal.Content image>
                      <Image wrapped size='medium' src='https://static1.squarespace.com/static/560d50c5e4b0f68fd092a78f/t/577cfee7893fc03a12adcedb/1495464043705/?format=1500w' />
                      <Modal.Description>
                        <p>DNO produce is a local food distributor committed to</p>
                        <p>providing high quality produce to Central Ohio restaurants</p>
                        <p>and stores. They do what they can to provide Ohio grown</p>
                        <p>produce and they have been instrumental in providing healthy food</p>
                        <p>for the Ohio State campus.</p>
                        <p>For more info, check em out <a href="https://dnoinc.com/" target="/blank">here.</a></p>
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                </div>
            </Card>
            {this.state.remainingCalendar.map((x) => (
              <Card style={{width: "800px", margin: "0 0 30px 0"}}>
              <CardTitle
                title={x[0]}
                subtitle={x[1]}
               />
              </Card>
            ))}
          </div>
        </div>
    </div>
    );
  }
}

export default Home;
