import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
      this.props.setVotes(votes);
      const checkIfUserHasPaidResult = await fetch('/transaction/check', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          firebaseAccessToken: this.props.firebaseAccessToken,
        }),
      });
      const checkIfUserHasPaidResultData = await checkIfUserHasPaidResult.json();
      this.props.setHasUserPaid(checkIfUserHasPaidResultData.hasUserPaid);
      this.props.enterVotesPage();
    }
  }

  async handleChange(e, { value, checked }) {
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
    await this.props.setBallotsAndVotes(newBallotsAndVotes);
    let newVote = this.props.votes;
    checked ? newVote-- : newVote++;
    await this.props.setVotes(newVote);
  }

  async handleContinueToPayment() {
    this.props.setVoteErrorMessage('');
    this.props.setAllowContinueToPayment('');
    if (this.props.votes !== 0) {
      this.props.setVoteErrorMessage('Remember to use all your votes! You can change them later.');
      this.props.setAllowContinueToPayment(false);
    }
    if (this.props.votes === 0) {
      this.props.setAllowContinueToPayment(true);
    }
  }

  async handleSubmitUpdateVotes() {
    this.props.setVoteErrorMessage('');
    this.props.setAllowContinueToPayment('');
    this.props.setVotesHaveFinishedUpdating('');
    if (this.props.votes !== 0) {
      this.props.setVoteErrorMessage('Remember to use all your votes! You can change them later.');
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
      this.props.setVotesHaveFinishedUpdating(responseData.votesSaved);
    } else {
      this.props.setVotesHaveFinishedUpdating(false);
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
              {this.props.ballotsAndVotes.map(ballotAndVote => (
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
                      onClick={this.handleSubmitUpdateVotes}
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
                    <Button
                      positive
                      onClick={this.handleContinueToPayment}
                    >
                      Continue to Payment
                    </Button>
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

const bundledActionCreators = Object.assign({},
  appActionCreators,
  votingActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Voting);
