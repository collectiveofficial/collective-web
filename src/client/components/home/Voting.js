import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as appActionCreators from '../../action-creators/appActions'
import * as votingActionCreators from '../../action-creators/votingActions' // TODO RENAME 2 VOTE
import s from './Home.css';
import { Card, Icon, Image, Checkbox, Popup, Dropdown, Feed, Modal, Header, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';
import Payment from './Payment.js';

class Voting extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleContinueToPayment = this.handleContinueToPayment.bind(this);
    this.handleSubmitUpdateVotes = this.handleSubmitUpdateVotes.bind(this);
  }

  async componentWillMount() {
    if (this.props.ballotsAndVotes.length > 0) {
      let votes = 6;
      for (let i = 0; i < this.props.ballotsAndVotes.length; i++) {
        if (this.props.ballotsAndVotes[i].isCurrent) {
          votes--;
        }
      }
      this.props.dispatch(votingActionCreators.setVotes(votes));
      const checkIfUserHasPaidResult = await fetch('/transaction/check', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          firebaseAccessToken: this.props.firebaseAccessToken,
          dropoffID: 1, //TODO: implement dynamic dropoffID
        }),
      });
      const checkIfUserHasPaidResultData = await checkIfUserHasPaidResult.json();
      this.props.dispatch(votingActionCreators.setHasUserPaid(checkIfUserHasPaidResultData.hasUserPaid));
      this.props.dispatch(votingActionCreators.enterVotesPage());
    }
  }

  handleChange(e, { value, checked }) {
    if (this.props.votes === 0 && checked === true) {
      checked = false;
      return;
    }
    const newBallotsAndVotes = this.props.ballotsAndVotes;
    for (let i = 0; i < newBallotsAndVotes.length; i++) {
      if (newBallotsAndVotes[i].name === value) {
        newBallotsAndVotes[i].isCurrent = checked;
      }
    }
    this.props.dispatch(appActionCreators.setBallotsAndVotes(newBallotsAndVotes));
    let newVote = this.props.votes;
    checked ? newVote-- : newVote++;
    this.props.dispatch(votingActionCreators.setVotes(newVote));
  }

  async handleContinueToPayment() {
    this.props.dispatch(votingActionCreators.setVoteErrorMessage(''));
    this.props.dispatch(votingActionCreators.setAllowContinueToPayment(''));
    if (this.props.votes !== 0) {
      this.props.dispatch(votingActionCreators.setVoteErrorMessage('Remember to use all your votes! You can change them later.'));
      this.props.dispatch(votingActionCreators.setAllowContinueToPayment(false));
    }
    if (this.props.votes === 0) {
      this.props.dispatch(votingActionCreators.setAllowContinueToPayment(true));
    }
  }

  async handleSubmitUpdateVotes() {
    this.props.dispatch(votingActionCreators.setVoteErrorMessage(''));
    this.props.dispatch(votingActionCreators.setAllowContinueToPayment(''));
    this.props.dispatch(votingActionCreators.setVotesHaveFinishedUpdating(''));
    if (this.props.votes !== 0) {
      this.props.dispatch(votingActionCreators.setVoteErrorMessage('Remember to use all your votes! You can change them later.'));
    }
    if (this.props.votes === 0) {
      const foodObj = {};
      for (let i = 0; i < this.props.ballotsAndVotes.length; i++) {
        foodObj[this.props.ballotsAndVotes[i].name] = this.props.ballotsAndVotes[i].isCurrent;
      }
      // save votes to DB and allow to continue to payment
      const response = await fetch('/vote/update', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          firebaseAccessToken: this.props.firebaseAccessToken,
          foodObj,
        }),
      });
      const responseData = await response.json();
      alert('Your votes have been updated.');
      this.props.dispatch(votingActionCreators.setVotesHaveFinishedUpdating(responseData.votesSaved));
    } else {
      this.props.dispatch(votingActionCreators.setVotesHaveFinishedUpdating(false));
    }
  }

  render() {
    console.log('Voting props: ', this.props);
    return (
      <div>
        {this.props.allowContinueToPayment ?
          <Payment/>
          :
          <div className={s.cont}>
            <h1 className={s.top}>You have {this.props.votes} votes left</h1>
            <div className={s.flexcontainer}>
              {this.props.ballotsAndVotes.map((ballotAndVote) => (
                <div className={s.ballot}>
                  <Card>
                    <Image src={ballotAndVote.imageUrl} />
                    <Card.Content>
                      <Card.Header>
                        {ballotAndVote.name}
                      </Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                      <Checkbox toggle
                        value={ballotAndVote.name}
                        onChange={this.handleChange}
                        checked={ballotAndVote.isCurrent}
                      />
                    </Card.Content>
                  </Card>
                </div>
              ))}
              {this.props.hasUserPaid ?
                <Popup
                  trigger={
                    <RaisedButton
                      label="Update Votes"
                      primary={true}
                      onTouchTap={this.handleSubmitUpdateVotes}
                    />
                  }
                  content={this.props.voteErrorMessage}
                  open={this.props.votesHaveFinishedUpdating === false}
                  offset={5}
                  position="bottom left"
                />
                :
                <Popup
                  trigger={
                    <RaisedButton
                      label="Continue to Payment"
                      primary={true}
                      onTouchTap={this.handleContinueToPayment}
                    />
                  }
                  content={this.props.voteErrorMessage}
                  open={this.props.allowContinueToPayment === false}
                  offset={5}
                  position="bottom left"
                />
              }
            </div>
          </div>
        }
        {this.props.votesHaveFinishedUpdating ?
          <Redirect to="/home" />
          :
          <div></div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  console.log('Voting: ',state, props);
  return {
    // App Reducers
    ballotsAndVotes: state.appReducer._ballotsAndVotes,
    firebaseAccessToken: state.appReducer._firebaseAccessToken,

    // Voting Reducers
    votes: state.votingReducer._votes,
    price: state.votingReducer._price,
    voteErrorMessage: state.votingReducer._voteErrorMessage,
    allowContinueToPayment: state.votingReducer._allowContinueToPayment,
    hasUserPaid: state.votingReducer._hasUserPaid,
    votesHaveFinishedUpdating: state.votingReducer._votesHaveFinishedUpdating
  }
};

const ConnectedVoting = connect(mapStateToProps)(Voting);

export default ConnectedVoting;
