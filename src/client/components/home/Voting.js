import React, { Component } from 'react';
import {
  Route,
  Link
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleContinueToPayment = this.handleContinueToPayment.bind(this);
  }

  componentWillMount() {
    if (this.props.ballotsAndVotes.length > 0) {
      let votes = 6;
      for (let i = 0; i < this.props.ballotsAndVotes.length; i++) {
        if (this.props.ballotsAndVotes[i].isCurrent) {
          votes--;
        }
      }
      this.setState({ votes });
    }
  }

  handleChange(e, { value, checked }) {
    if (this.state.votes === 0 && checked === true) {
      checked = false;
      return;
    }
    const newBallotsAndVotes = this.props.ballotsAndVotes;
    console.log('-----> checked: ', checked);
    for (let i = 0; i < newBallotsAndVotes.length; i++) {
      if (newBallotsAndVotes[i].name === value) {
        newBallotsAndVotes[i].isCurrent = checked;
      }
    }
    console.log('old this.props.ballotsAndVotes: ', this.props.ballotsAndVotes);
    this.props.updateBallotsAndVotes(newBallotsAndVotes);
    console.log('new this.props.ballotsAndVotes: ', this.props.ballotsAndVotes);
    let newVote = this.state.votes;
    checked ? newVote-- : newVote++;
    this.setState({ votes: newVote });
  }

  async handleContinueToPayment() {
    await this.setState({ voteErrorMessage: '' });
    await this.setState({ allowContinueToPayment: '' });
    console.log('-------> handleContinueToPayment was triggered');
    if (this.state.votes !== 0) {
      await this.setState({ voteErrorMessage: 'Remember to use all your votes! You can change them later.' });
      this.setState({ allowContinueToPayment: false });
    }
    if (this.state.votes === 0) {
      const foodObj = {};
      for (let i = 0; i < this.props.ballotsAndVotes.length; i++) {
        foodObj[this.props.ballotsAndVotes[i].name] = this.props.ballotsAndVotes[i].isCurrent;
      }
      // save votes to DB and allow to continue to payment
      const response = await fetch('/vote/save', {
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
      if (responseData.votesSaved) {
        this.setState({ allowContinueToPayment: true });
      } else {
        this.setState({ allowContinueToPayment: false });
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.allowContinueToPayment ?
          <Payment firebaseAccessToken={this.props.firebaseAccessToken} />
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
              <Popup
                trigger={
                  <RaisedButton
                    label="Continue to Payment"
                    primary={true}
                    onClick={this.handleContinueToPayment}
                  />
                }
                content={this.state.voteErrorMessage}
                open={this.state.allowContinueToPayment === false}
                offset={5}
                position="bottom left"
              />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Voting;
