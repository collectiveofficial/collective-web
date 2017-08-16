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
import { ref, firebaseAuth } from '../../config';

const numOptions = [
  {text: "0", value: "0"},
  {text: "1", value: "1"},
  {text: "2", value: "2"},
  {text: "3", value: "3"},
  {text: "4", value: "4"},
  {text: "5", value: "5"},
  {text: "6", value: "6"},
  {text: "7", value: "7"},
];

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      price: 0,
      paymentErrorMessage: '',
      dorm: 0,
      cook: 0,
      hasPaymentCompleted: false,
      votesSaved: false,
    };
    this.handleDorm = this.handleDorm.bind(this);
    this.handleCook = this.handleCook.bind(this);
    this.onToken = this.onToken.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
  }

  handleDorm(e, { value }) {
    this.setState({ dorm: value });
    let newPrice = this.state.price;
    newPrice = ((value * 6) + (this.state.cook * 11));
    this.setState({ price: newPrice });
  }

  handleCook(e, { value }) {
    this.setState({ cook: value });
    let newPrice = this.state.price;
    newPrice = ((this.state.dorm * 6) + (value * 11));
    this.setState({ price: newPrice });
  }

  async submitInitialVotes() {
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
      this.setState({ votesSaved: true });
    } else {
      this.setState({ votesSaved: false });
    }
  }

  async handlePayment() {
    await this.setState({ paymentErrorMessage: '' });
    if (this.state.price === 0) {
      await this.setState({ paymentErrorMessage: 'Please specify an amount for the packages.' });
    }
  }

  async onToken(token) {
    await this.setState({ hasPaymentCompleted: false });
    const email = await firebaseAuth().currentUser.email;
    console.log('--------> email: ', email);
    const submitPaymentResult = await fetch('/confirm-payment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken: this.props.firebaseAccessToken,
        token,
        // price: this.state.price,
        email,
        dormPackagesOrdered: this.state.dorm,
        cookingPackagesOrdered: this.state.cook,
      }),
    });
    const submitPaymentResultData = await submitPaymentResult.json();
    if (submitPaymentResultData.paymentCompleted) {
      await this.submitInitialVotes();
      if (this.state.votesSaved) {
        alert(`Thank you for voting! Your votes are now recorded. Your receipt has been sent to ${submitPaymentResultData.emailSentTo}`);
        await this.setState({ hasPaymentCompleted: true });
      } else {
        alert('Voting failed. Please contact Collective to resolve this issue. We appreciate your patience.');
      }
    } else {
      alert('Payment failed. Please contact Collective to resolve this issue. We appreciate your patience.');
      await this.setState({ hasPaymentCompleted: false });
    }
  }


  render() {
    const styles = {
      stripe: {
        visibility: 'hidden',
      },
      transperencyModal: {
        display: 'inline',
        float: 'right',
      },
    };


    return (
      <div>
        <div className={s.cont}>
          <div className={s.ballot}>
            <Card>
              <Card.Content>
                <Card.Header>
                  Payment
                </Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Summary>
                        <span>
                          I'd like {' '}
                          <Dropdown inline options={numOptions}
                            onChange={this.handleDorm}
                            defaultValue={numOptions[0].value}
                          /><Modal trigger={<div className={s.mode}>dorm packages</div>} basic size='small'>
                            <Modal.Header>Dorm package</Modal.Header>
                            <Modal.Content image>
                              <Modal.Description>
                                <p>Our dorm package is $6 and made especially for college kids on the run.</p>
                                <p>Everything is fresh and nothing needs preparation. Our past dorm packages</p>
                                <p>included 6 apples, 1 pound of carrots, 4 bananas, 6 kiwis, 1.5 lbs of grapes,</p>
                                <p>and 5 oranges.</p>
                                </Modal.Description>
                            </Modal.Content>
                          </Modal>
                        </span>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  <br />
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Summary>
                        <span>
                          I'd like {' '}
                          <Dropdown inline options={numOptions}
                            onChange={this.handleCook}
                            defaultValue={numOptions[0].value}
                          /><Modal trigger={<div className={s.mode}>cooking packages</div>} basic size='small' closeIcon="close">
                            <Modal.Header>Cooking package</Modal.Header>
                            <Modal.Content image>
                              <Modal.Description>
                                <p>Our cooking package is $11 and includes food that, well...can be cooked! (:</p>
                                <p>To give you an idea, a package in the past has included 6 apples</p>
                                <p>1 pound of carrots, 4 bananas, 1.5 pounds of grapes, 6 kiwis, 2 onions</p>
                                <p>a half pound of spinach, 5 sweet potatoes, and 1 pound of tomatoes.</p>
                                </Modal.Description>
                            </Modal.Content>
                          </Modal>
                        </span>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  <br />
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Summary>
                        Total ${this.state.price} <Modal trigger={<div className={s.mode}>?</div>} basic size='small' closeIcon='close' style={styles.transperencyModal}>
                          <Modal.Content image>
                            <Modal.Description>
                              <p>We made this app to make it easier for everyone to vote and organize, on the buyer side</p>
                              <p>as well as the seller side. The hope is that having a more automated system</p>
                              <p> can allow us to put less hours into organizing bulk buys so that we can serve more.</p>
                              <p>But, with that, comes payment transaction fees and hosting fees just to keep the site up.</p>
                              <p>So your total will contain a small standard transaction fee for using Stripe (2.9% + $.30) as well as</p>
                              <p>a small processing fee to cover web hosting. If you have any questions please contact us through our feedback <a href="https://docs.google.com/forms/d/e/1FAIpQLSdMJUSKNvto7jxcY800Z3ocrU7Hu7CSeu5B7M6s9ZJr7vGyzA/viewform?usp=sf_link" target="/blank">form</a>.</p>
                              </Modal.Description>
                          </Modal.Content>
                        </Modal>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  <Popup
                    trigger={<Feed.Event onClick={this.handlePayment}>
                      <Feed.Content>
                        <Feed.Summary>
                              {this.state.price > 0 ? (
                                <StripeCheckout
                                    // style={styles.stripe}
                                    name="Best Food Forward/Collective" // the pop-in header title
                                    description="Easy healthy eating" // the pop-in header subtitle
                                    ComponentClass="div"
                                    // panelLabel="Give Money" prepended to the amount in the bottom pay button
                                    amount={this.state.price * 100} // cents
                                    currency="USD"
                                    stripeKey="pk_test_o6trMS2lojkAKMM0HbRJ0tDI"
                                    email="bestfoodforward@osu.edu"
                                    // Note: Enabling either address option will give the user the ability to
                                    // fill out both. Addresses are sent as a second parameter in the token callback.
                                    shippingAddress
                                    billingAddress={false}
                                    // Note: enabling both zipCode checks and billing or shipping address will
                                    // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                                    zipCode={false}
                                    allowRememberMe // "Remember Me" option (default true)
                                    token={this.onToken} // submit callback
                                    opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
                                    closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)
                                    // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
                                    // you are using multiple stripe keys
                                    reconfigureOnUpdate={false}
                                    // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
                                    // useful if you're using React-Tap-Event-Plugin
                                    triggerEvent="onTouchTap"
                                    >
                                    </StripeCheckout>
                              ) : (
                                <RaisedButton label="Pay With Card" primary={true} onClick={this.handlePayment} >
                                </RaisedButton>
                              )}
                        </Feed.Summary>
                      </Feed.Content>
                    </Feed.Event>
                    }
                    content={this.state.paymentErrorMessage}
                    open={this.state.paymentErrorMessage.length > 0}
                    offset={20}
                    position="right center"
                  />
                </Feed>
              </Card.Content>
            </Card>
          </div>
        </div>
        {this.state.hasPaymentCompleted ?
          <Redirect to="/home" />
          :
          <div></div>
        }
      </div>
    )
  }
}

export default Payment;
