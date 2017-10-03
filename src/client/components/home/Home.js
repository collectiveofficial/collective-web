import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as homeActionCreators from '../../action-creators/homeActions'
import { Image, Modal } from 'semantic-ui-react';
import s from './Home.css';
import Voting from './Voting.js';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Message } from 'semantic-ui-react'


const Home = props => (
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
        {/* <Message color='blue'>Next pickup: 22 September 2017 from 8:00 AM to 4:00 PM at Scott House</Message> */}
        <Card style={{width: "800px", margin: "0 0 30px 0"}}>
          <CardTitle
            title={props.date}
            subtitle={props.vote}
          />
          <iframe
            className={s.map}
            src={props.location}
          />
          <div className={s.links}>
            <Link className={s.link} to="/voting">Vote and Pay</Link>
            <Modal trigger={<a className={s.link} href="javascript:void(0)">Provider info</a>} closeIcon="close">
              <Modal.Header>{props.provider}</Modal.Header>
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
        {props.remainingCalendar.map(x => (
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

const mapStateToProps = (state) => {
  return {
    authenticated: state.appReducer._userAuthenticated, // TODO RENAME
    date: state.homeReducer._date,
    vote: state.homeReducer._vote,
    remainingCalendar: state.homeReducer._remainingCalendar,
    items: state.homeReducer._items,
    provider: state.homeReducer._provider,
    location: state.homeReducer._location,
  }
};

export default connect(mapStateToProps)(Home);
