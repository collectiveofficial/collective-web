import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as paymentActionCreators from '../../action-creators/paymentActions'
import s from './Home.css';
import { Card, Icon, Popup, Dropdown, Feed, Modal, Segment, Checkbox, Label, Message, Grid } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';
import { ref, firebaseAuth } from '../../config';
import PaymentConfirmation from './PaymentConfirmation.js';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.handleAllergies = this.handleAllergies.bind(this);
    this.handleDorm = this.handleDorm.bind(this);
    this.handleCook = this.handleCook.bind(this);
    this.onToken = this.onToken.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleDelivery = this.handleDelivery.bind(this);
    this.handleAllergiesChange = this.handleAllergiesChange.bind(this);
  }

  async componentWillMount() {
    const email = await firebaseAuth().currentUser.email;
    console.log('Payment is mounting');
    await this.props.dispatch(paymentActionCreators.enterPaymentPage());
    this.props.dispatch(paymentActionCreators.setPaymentEmail(email));
  }

  async handleAllergies({ checked }) {
    this.props.dispatch(paymentActionCreators.setHasAllegies(!this.props.hasAllergies));
    if (this.props.hasAllergies === false) {
      this.props.dispatch(paymentActionCreators.setAllergiesList([]));
    }
  }

  handleDorm(e, { value }) {
    this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage(''));
    this.props.dispatch(paymentActionCreators.setDorm(value));
    let newPrice = this.props.price;
    newPrice = ((value * 6) + (this.props.cook * 11)) + this.props.deliveryPriceImpact;
    this.props.dispatch(paymentActionCreators.setPrice(newPrice));
  }

  handleCook(e, { value }) {
    this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage(''));
    this.props.dispatch(paymentActionCreators.setCook(value));
    let newPrice = this.props.price;
    newPrice = ((this.props.dorm * 6) + (value * 11)) + this.props.deliveryPriceImpact;
    this.props.dispatch(paymentActionCreators.setPrice(newPrice));
  }

  async handleDelivery() {
    if (this.props.availableDeliveriesLeft === 0) {
      this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage('There are no more available deliveries left for this round of bulk buy. We apologize for any inconvenience. We promise we\'ll be back with more deliveries in the future.'));
    } else {
      if (!this.props.deliveryEligibilityObj.isUserEligibleForDelivery) {
        if (this.props.deliveryEligibilityObj.isAddressDorm) {
          this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage('It looks like your address is a dorm address. Our pickup location is not far away.'));
        }
        if (this.props.deliveryEligibilityObj.isAddressBeyondDeliveryReach) {
          this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage('It looks like your address is beyond our 5 mile delivery boundaries. We will try our best to extend our delivery boundaries in our next bulk buy. Thank you for your patience.'));
        }
      } else {
        if (this.props.cook === 0) {
          this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage('You would need to purchase at least 1 cooking package for delivery'));
        } else {
          await this.props.dispatch(paymentActionCreators.setUserWantsDelivery(!this.props.userWantsDelivery));
          if (this.props.userWantsDelivery) {
            this.props.dispatch(paymentActionCreators.setDeliveryPriceImpact(3));
            this.props.dispatch(paymentActionCreators.setPrice(this.props.price + 3));

          } else {
            this.props.dispatch(paymentActionCreators.setDeliveryPriceImpact(0));
            this.props.dispatch(paymentActionCreators.setPrice(this.props.price - 3));
          }
        }
      }
    }
  }

  async handlePayment() {
    this.props.dispatch(paymentActionCreators.setPaymentErrorMessage(''));
    this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage(''));
    if (this.props.price === 0) {
      this.props.dispatch(paymentActionCreators.setPaymentErrorMessage('Please specify an amount for the packages.'));
    }
  }

  async onToken(token) {
    this.props.dispatch(paymentActionCreators.setHasPaymentCompleted(false));
    const foodObj = {};
    for (let i = 0; i < this.props.ballotsAndVotes.length; i++) {
      foodObj[this.props.ballotsAndVotes[i].name] = {
        isCurrent: this.props.ballotsAndVotes[i].isCurrent,
        isAllergic: this.props.allergiesList.indexOf(this.props.ballotsAndVotes[i].name) > -1 ? true : false,
      };
    }
    const submitPaymentResult = await fetch('/payment-votes/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken: this.props.firebaseAccessToken,
        token,
        email: this.props.paymentEmail,
        dormPackagesOrdered: this.props.dorm,
        cookingPackagesOrdered: this.props.cook,
        userWantsDelivery: this.props.userWantsDelivery,
        hasAllergies: this.props.hasAllergies,
        foodObj,
      }),
    });

    const submitPaymentResultData = await submitPaymentResult.json();
    this.props.dispatch(paymentActionCreators.setServerPaymentErrorMessage(submitPaymentResultData.errorMessage));
    // handle for delivery error message from server (must order at least 1 cooking package and make sure count <= 50)
    if (this.props.serverPaymentErrorMessage.length === 0) {
      if (submitPaymentResultData.paymentCompleted) {
        this.props.dispatch(paymentActionCreators.setHasPaymentCompleted(true));
      } else {
        alert('Payment failed. Please contact Collective to resolve this issue. We appreciate your patience.');
        this.props.dispatch(paymentActionCreators.setHasPaymentCompleted(false));
      }
    }
  }

  async handleAllergiesChange(e, { value, checked }) {
    const allergiesList = this.props.allergiesList.slice('');
    if (checked) {
      allergiesList.push(value);
    } else {
      const allergiesIndex = allergiesList.indexOf(value);
      allergiesList.splice(allergiesIndex, 1);
    }

    this.props.dispatch(paymentActionCreators.setAllergiesList(allergiesList));
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
      deliveryModalImportant: {
        margin: '0 0 0 0',
      },
      allergiesModal: {
        margin: '0 0 0 0',
      },
    };

    const dormNumOptions = [
      { text: 0, value: 0 },
      { text: 1, value: 1 },
      { text: 2, value: 2 },
      { text: 3, value: 3 },
      { text: 4, value: 4 },
      { text: 5, value: 5 },
      { text: 6, value: 6 },
      { text: 7, value: 7 },
    ];
    const cookNumOptions = [
      { text: 0, value: 0, disabled: this.props.userWantsDelivery },
      { text: 1, value: 1 },
      { text: 2, value: 2 },
      { text: 3, value: 3 },
      { text: 4, value: 4 },
      { text: 5, value: 5 },
      { text: 6, value: 6 },
      { text: 7, value: 7 },
    ];

    return (
      <div>
        <div className={s.cont}>
          <div className={s.ballot}>
            {this.props.hasPaymentCompleted ?
              <PaymentConfirmation email={this.props.paymentEmail} />
              :
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
                            <Dropdown inline options={dormNumOptions}
                              onChange={this.handleDorm}
                              defaultValue={dormNumOptions[0].value}
                            /><Modal trigger={<a className={s.mode}>dorm packages ($6)</a>} basic size='small' closeIcon="close">
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
                          <Dropdown inline options={cookNumOptions}
                            onChange={this.handleCook}
                            defaultValue={cookNumOptions[0].value}
                          /><Modal trigger={<a className={s.mode}>cooking packages ($11)</a>} basic size='small' closeIcon="close">
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
                  <Segment compact>
                    <Label color='red' floating>New!</Label>
                    <Checkbox inline checked={this.props.userWantsDelivery} onClick={this.handleDelivery} />
                    <Modal trigger={<a className={s.mode}>Delivery ($3)</a>} basic size='small' closeIcon="close">
                    <Modal.Header>Introducing Delivery</Modal.Header>
                    <Modal.Content image>
                      <Modal.Description>
                        <h5>How It Works:</h5>
                        <ol>
                          <li>BFF drivers start deliveries at 9 AM</li>
                          <li>You will receive a text to let you know the estimated time of arrival</li>
                          <li>You will receive another text when the package is 5 minutes away</li>
                        </ol>
                        <br />
                        <Message info>
                          <Message.Header as="h5">Important:</Message.Header>
                          <p style={styles.deliveryModalImportant}>We will only be able to drop packages off at the door to the apartment,</p>
                          <p style={styles.deliveryModalImportant}>house, etc. Please be ready to pickup the package directly or leave</p>
                          <p style={styles.deliveryModalImportant}>a cooler out front for the driver to leave the package in.</p>
                        </Message>
                        <br />
                        <h5>Requirements for Addresses:</h5>
                        <ul>
                          <li>Address has to be within 5 miles of Scott House</li>
                          <li>Address cannot be a dorm</li>
                        </ul>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                    <p>Limit 50 participants</p>
                    <p>Available deliveries left: {this.props.availableDeliveriesLeft}</p>
                  </Segment>
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Summary>
                        Total = ${this.props.price} <Modal trigger={<Icon link size="large" name='help circle' />} basic size='small' closeIcon='close'>
                        <Modal.Content image>
                          <Modal.Description>
                            <br /><br />
                            <p>Collective's primary goal is to empower food coops and community groups</p>
                            <p>through technological solutions to basic organizational challenges.</p>
                            <p>While maintaining low customer cost is a priority, we must still cover basic</p>
                            <p>expenses in order to maintain our site while securely handling payments.</p>
                            <p>So every payment includes a standard 2.9% + $.30 fee through our payment provider Stripe.</p>
                            <p>If you have any questions please contact us through our feedback <a href="https://docs.google.com/forms/d/e/1FAIpQLSdMJUSKNvto7jxcY800Z3ocrU7Hu7CSeu5B7M6s9ZJr7vGyzA/viewform?usp=sf_link" target="/blank">form</a>.</p>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
                <Checkbox inline checked={this.props.hasAllergies} onClick={this.handleAllergies} />
                <Modal trigger={<a className={s.mode}>I am allergic to one or more of the produces from this bulk buy</a>} basic size='small' closeIcon="close">
                <Modal.Header>Safety Is Our Top Priority</Modal.Header>
                <Modal.Content image>
                  <Modal.Description>
                    <p>Best Food Forward and Collective are committed to meeting the food safety requirements of all of our members.</p>
                    <h5>Allergies</h5>
                    <p style={styles.allergiesModal}>We will accommodate the needs of all of our members with allergies.</p>
                    <p style={styles.allergiesModal}>All produce will be stored and processed separately with special consideration for cross-contamination.</p>
                    <p style={styles.allergiesModal}>On the day of the event, we will specially prepare all allergy-affected packages separately.</p>
                    <p style={styles.allergiesModal}>If you have any suggestions for how we can better meet the needs of those with health considerations,</p>
                    <p style={styles.allergiesModal}>please provide feedback at the form at the bottom of the page.</p>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
                {this.props.hasAllergies ?
                  <div style={styles.allergiesBox}>
                    <br />
                    <p>Which of these produces are you allergic to?</p>
                    <Grid columns={2}>
                      {this.props.ballotsAndVotes.map((ballotAndVote) => {
                        return (
                          <Grid.Column key={ballotAndVote.name}>
                            <Checkbox
                              label={ballotAndVote.name}
                              value={ballotAndVote.name}
                              onChange={this.handleAllergiesChange}
                            />
                          </Grid.Column>
                        );
                      })}
                    </Grid>
                    <br />
                  </div>
                  :
                  <div></div>
                }
                <Popup
                  trigger={<Feed.Event onClick={this.handlePayment}>
                  <Feed.Content>
                    <Feed.Summary>
                      {this.props.price > 0 ? (
                        <StripeCheckout
                          // style={styles.stripe}
                          name="Best Food Forward/Collective" // the pop-in header title
                          description="Easy healthy eating" // the pop-in header subtitle
                          ComponentClass="div"
                          // panelLabel="Give Money" prepended to the amount in the bottom pay button
                          amount={this.props.price * 100} // cents
                          currency="USD"
                          stripeKey="pk_live_sJsPA40Mp18TUyoMH2CmCWIG"
                          email={this.props.paymentEmail}
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
                          <RaisedButton label="Pay With Card" primary={true} onTouchTap={this.handlePayment} />
                        )}
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                }
                content={this.props.paymentErrorMessage}
                open={this.props.paymentErrorMessage.length > 0}
                offset={20}
                position="right center"
              />
              {this.props.serverPaymentErrorMessage.length > 0 ?
                <Message warning>
                  <p>{this.props.serverPaymentErrorMessage}</p>
                </Message>
                :
                <div></div>
              }
            </Feed>
          </Card.Content>
        </Card>

            }
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, props) => {
  return {
    // App Reducers
    ballotsAndVotes: state.appReducer._ballotsAndVotes,
    firebaseAccessToken: state.appReducer._firebaseAccessToken,
    availableDeliveriesLeft: state.appReducer._availableDeliveriesLeft,
    deliveryEligibilityObj: state.appReducer._deliveryEligibilityObj,
    // Payment reducers
    modalIsOpen: state.paymentReducer._modalIsOpenState,
    price: state.paymentReducer._price,
    paymentErrorMessage: state.paymentReducer._paymentErrorMessage,
    dorm: state.paymentReducer._dorm,
    cook: state.paymentReducer._cook,
    hasPaymentCompleted: state.paymentReducer._hasPaymentCompleted,
    votesSaved: state.paymentReducer._votesSaved,
    hasAllergies: state.paymentReducer._hasAllergies,
    paymentEmail: state.paymentReducer._paymentEmail,
    userWantsDelivery: state.paymentReducer._userWantsDelivery,
    serverPaymentErrorMessage: state.paymentReducer._serverPaymentErrorMessage,
    deliveryPriceImpact: state.paymentReducer._deliveryPriceImpact,
    allergiesList: state.paymentReducer._allergiesList
  }
};



const ConnectedPayment = connect(mapStateToProps)(Payment);

export default ConnectedPayment;
