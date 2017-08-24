import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import s from './Home.css';
import { Card, Icon, Image, Checkbox, Popup, Dropdown, Feed, Modal, Header, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';
import Payment from './Payment.js';

class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votes: 6,
      price: 0,
      voteErrorMessage: '',
      allowContinueToPayment: '',
      hasUserPaid: false,
      votesHaveFinishedUpdating: '',
    };

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
      await this.setState({ votes });
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
      this.setState({ hasUserPaid: checkIfUserHasPaidResultData.hasUserPaid });
    }
  }

  handleChange(e, { value, checked }) {
    if (this.state.votes === 0 && checked === true) {
      checked = false;
      return;
    }
    const newBallotsAndVotes = this.props.ballotsAndVotes;
    for (let i = 0; i < newBallotsAndVotes.length; i++) {
      if (newBallotsAndVotes[i].name === value) {
        newBallotsAndVotes[i].isCurrent = checked;
      }
    }
    this.props.updateBallotsAndVotes(newBallotsAndVotes);
    let newVote = this.state.votes;
    checked ? newVote-- : newVote++;
    this.setState({ votes: newVote });
  }

  async handleContinueToPayment() {
    await this.setState({ voteErrorMessage: '' });
    await this.setState({ allowContinueToPayment: '' });
    if (this.state.votes !== 0) {
      await this.setState({ voteErrorMessage: 'Remember to use all your votes! You can change them later.' });
      this.setState({ allowContinueToPayment: false });
    }
    if (this.state.votes === 0) {
      this.setState({ allowContinueToPayment: true });
    }
  }

  async handleSubmitUpdateVotes() {
    await this.setState({ voteErrorMessage: '' });
    await this.setState({ allowContinueToPayment: '' });
    await this.setState({ votesHaveFinishedUpdating: '' });
    if (this.state.votes !== 0) {
      await this.setState({ voteErrorMessage: 'Remember to use all your votes! You can change them later.' });
    }
    if (this.state.votes === 0) {
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
      await this.setState({ votesHaveFinishedUpdating: responseData.votesSaved });
    } else {
      this.setState({ votesHaveFinishedUpdating: false });
    }
  }

  render() {
    return (
      <div>
        {this.state.allowContinueToPayment ?
          <Payment
            firebaseAccessToken={this.props.firebaseAccessToken}
            ballotsAndVotes={this.props.ballotsAndVotes}
          />
          :
          <div className={s.cont}>
            <h1 className={s.top}>You have {this.state.votes} votes left</h1>
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
              {this.state.hasUserPaid ?
                <Popup
                  trigger={
                    <RaisedButton
                      label="Update Votes"
                      primary={true}
                      onTouchTap={this.handleSubmitUpdateVotes}
                    />
                  }
                  content={this.state.voteErrorMessage}
                  open={this.state.votesHaveFinishedUpdating === false}
                  offset={5}
                  position="bottom left"
                />
                :
                <Popup
                  trigger={
                    <Button
                      positive
                      onTouchTap={this.handleContinueToPayment}
                    >
                      Continue to Payment
                    </Button>
                  }
                  content={this.state.voteErrorMessage}
                  open={this.state.allowContinueToPayment === false}
                  offset={5}
                  position="bottom left"
                />
              }
            </div>
          </div>
        }
        {this.state.votesHaveFinishedUpdating ?
          <Redirect to="/home" />
          :
          <div></div>
        }
      </div>
    );
  }
}

export default Voting;
