import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import s from './Voting.css';
import { Popup, Button } from 'semantic-ui-react';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import RaisedButton from 'material-ui/RaisedButton';

class Voting extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleContinueToPayment = this.handleContinueToPayment.bind(this);
    this.handleSubmitUpdateVotes = this.handleSubmitUpdateVotes.bind(this);
  }

  async componentWillMount() {
    if (this.props.appReducers.ballotsAndVotes.length > 0) {
      let votes = 6;
      for (let i = 0; i < this.props.appReducers.ballotsAndVotes.length; i++) {
        if (this.props.appReducers.ballotsAndVotes[i].isCurrent) {
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
          firebaseAccessToken: this.props.appReducers.firebaseAccessToken,
        }),
      });
      const checkIfUserHasPaidResultData = await checkIfUserHasPaidResult.json();
      this.props.setHasUserPaid(checkIfUserHasPaidResultData.hasUserPaid);
      this.props.enterVotesPage();
    }
  }

  async handleChange(value, checked) {
    if (this.props.votes === 0 && checked === false) {
      return;
    }
    checked = !checked;
    const newBallotsAndVotes = this.props.appReducers.ballotsAndVotes;
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
      for (let i = 0; i < this.props.appReducers.ballotsAndVotes.length; i++) {
        foodObj[this.props.appReducers.ballotsAndVotes[i].name] = this.props.appReducers.ballotsAndVotes[i].isCurrent;
      }
      // save votes to DB and allow to continue to payment
      const response = await fetch('/vote/update', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          firebaseAccessToken: this.props.appReducers.firebaseAccessToken,
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
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        'justify-content': 'center',
      },
      gridList: {
        width: '80%',
        height: '50%',
        overflowY: 'auto',
      },
      bottomButton: {
        display: 'flex',
        'justify-content': 'center',
        margin: '0.5% 0 0.5% 0',
      },
    };
    return (
      <div>
        {this.props.allowContinueToPayment ?
          <Redirect to="/payment" />
          :
          <div>
            <h1 className={s.top}>You have {this.props.votes} votes left</h1>
            <div style={styles.root}>
              <GridList
                style={styles.gridList}
                cols={3}
              >
                  {this.props.appReducers.ballotsAndVotes.map(ballotAndVote => (
                    <GridTile
                      key={ballotAndVote.imageUrl}
                      title={ballotAndVote.name}
                      actionIcon={
                        <IconButton>
                          <CheckCircle
                            color={ballotAndVote.isCurrent ?
                              'rgb(30, 227, 91)'
                              :
                              'rgb(162, 153, 158)'
                            }
                          />
                        </IconButton>}
                        onClick={() => {
                          this.handleChange(ballotAndVote.name, ballotAndVote.isCurrent);
                        }}
                        >
                          <img src={ballotAndVote.imageUrl} />
                        </GridTile>
                      ))}
                    </GridList>
                    </div>
                    <div style={styles.bottomButton}>
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

export default Voting;
