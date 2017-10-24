import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import { Image, Modal } from 'semantic-ui-react';
import s from './Home.css';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Message, Icon, Header } from 'semantic-ui-react';
import momentTZ from 'moment-timezone';
import HomeMapContainer from './containers/HomeMapContainer.js';

const Home = (props) => {
  const styles = {
    foodTruckIcon: {
      margin: '0.5% 0 0 43.5%',
    },
    header: {
      margin: '0 0 0 35%',
    }
  };
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
          {/* <Message color='blue'>Next pickup: 17 October 2017 from 4:00 PM to 7:00 PM at Buckeye Village Family Housing</Message> */}
          {props.homeReducers.currentFutureDropoffs.map((currentFutureDropoff, index) => {
            return (
              <Card style={{ width: "800px", margin: "0 0 30px 0" }}>
                {/* <Icon name="truck" size="huge" style={styles.foodTruckIcon} />
                <Header as="h2" style={styles.header}>Food Truck Bulk Buy</Header> */}
                <CardTitle
                  title={`${momentTZ.tz(currentFutureDropoff.intendedPickupTimeStart, 'America/New_York').format('DD MMMM YYYY')} from ${momentTZ.tz(currentFutureDropoff.intendedPickupTimeStart, 'America/New_York').format('hh:mm a')} to ${momentTZ.tz(currentFutureDropoff.intendedPickupTimeEnd, 'America/New_York').format('hh:mm a')}`}
                  subtitle={`Voting window is from ${momentTZ.tz(currentFutureDropoff.voteDateTimeBeg, 'America/New_York').format('DD MMMM YYYY hh:mm a')} to ${momentTZ.tz(currentFutureDropoff.voteDateTimeEnd, 'America/New_York').format('DD MMMM YYYY hh:mm a')}`}
                />
                {index === 0 ?
                  <div>
                    <div>
                      <HomeMapContainer />
                    </div>
                    <div className={s.links}>
                      <Link className={s.link} to="/voting">Vote and Pay</Link>
                      <Modal trigger={<a className={s.link} href="javascript:void(0)">Provider info</a>} closeIcon="close">
                      <Modal.Header>{props.homeReducers.provider}</Modal.Header>
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
                  </div>
                  :
                  <div></div>
                }
            </Card>
            )
          })}
        </div>
      </div>
    </div>
)};

export default Home;
