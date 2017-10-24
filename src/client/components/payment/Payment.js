import React, { Component } from 'react';
import {
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import s from './Payment.css';
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
    await this.props.enterPaymentPage();
    await this.props.setPaymentEmail(email);
  }

  async handleAllergies({ checked }) {
    await this.props.setHasAllegies(!this.props.hasAllergies);
    if (this.props.hasAllergies === false) {
      await this.props.setAllergiesList([]);
    }
  }

  handleDorm(e, { value }) {
    this.props.setServerPaymentErrorMessage('');
    this.props.setDorm(value);
    let newPrice = this.props.price;
    newPrice = ((value * 6) + (this.props.cook * 6)) + this.props.deliveryPriceImpact;
    this.props.setPrice(newPrice);
  }

  handleCook(e, { value }) {
    this.props.setServerPaymentErrorMessage('');
    this.props.setCook(value);
    let newPrice = this.props.price;
    newPrice = ((this.props.dorm * 6) + (value * 6)) + this.props.deliveryPriceImpact;
    this.props.setPrice(newPrice);
  }

  async handleDelivery() {
    if (this.props.availableDeliveriesLeft === 0) {
      this.props.setServerPaymentErrorMessage('There are no more available deliveries left for this round of bulk buy. We apologize for any inconvenience. We promise we\'ll be back with more deliveries in the future.');
    } else {
      if (!this.props.appReducers.deliveryEligibilityObj.isUserEligibleForDelivery) {
        if (this.props.appReducers.deliveryEligibilityObj.isAddressDorm) {
          this.props.setServerPaymentErrorMessage('It looks like your address is a dorm address. Our pickup location is not far away.');
        }
        if (this.props.appReducers.deliveryEligibilityObj.isAddressBeyondDeliveryReach) {
          this.props.setServerPaymentErrorMessage('It looks like your address is beyond our 5 mile delivery boundaries. We will try our best to extend our delivery boundaries in our next bulk buy. Thank you for your patience.');
        }
      } else {
        if (this.props.cook === 0) {
          this.props.setServerPaymentErrorMessage('You would need to purchase at least 1 cooking package for delivery');
        } else {
          await this.props.setUserWantsDelivery(!this.props.userWantsDelivery);
          if (this.props.userWantsDelivery) {
            this.props.setDeliveryPriceImpact(3);
            this.props.setPrice(this.props.price + 3);

          } else {
            this.props.setDeliveryPriceImpact(0);
            this.props.setPrice(this.props.price - 3);
          }
        }
      }
    }
  }

  async handlePayment() {
    this.props.setPaymentErrorMessage('');
    this.props.setServerPaymentErrorMessage('');
    if (this.props.price === 0) {
      this.props.setPaymentErrorMessage('Please specify an amount for the packages.');
    }
  }

  async onToken(token) {
    this.props.setHasPaymentCompleted(false);
    const foodObj = {};
    for (let i = 0; i < this.props.appReducers.ballotsAndVotes.length; i++) {
      foodObj[this.props.appReducers.ballotsAndVotes[i].name] = {
        isCurrent: this.props.appReducers.ballotsAndVotes[i].isCurrent,
        isAllergic: this.props.allergiesList.indexOf(this.props.appReducers.ballotsAndVotes[i].name) > -1 ? true : false,
      };
    }
    const submitPaymentResult = await fetch('/payment-votes/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        firebaseAccessToken: this.props.appReducers.firebaseAccessToken,
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
    this.props.setServerPaymentErrorMessage(submitPaymentResultData.errorMessage);
    if (this.props.serverPaymentErrorMessage.length === 0) {
      if (submitPaymentResultData.paymentCompleted) {
        this.props.setHasPaymentCompleted(true);
      } else {
        this.props.setHasPaymentCompleted(false);
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

    this.props.setAllergiesList(allergiesList);
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
        <div className={s.conte}>
          <div className={s.plate}>
            {this.props.hasPaymentCompleted ?
              <PaymentConfirmation email={this.props.paymentEmail} />
              :
              <Card fluid>
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
                          <Card centered fluid>
                            {/* <Image src='https://static1.squarespace.com/static/54b3f75ee4b0cdf625ece0b0/t/56a01d17fb36b1be191dd048/1453333785451/market+basket+blueberries+radishes+cropped.jpg?format=1500w' /> */}
                            <Card.Content header='Dorm Package' />
                            <Card.Content>
                              Our dorm package is $6 and made especially for college kids on the run. Everything is fresh and nothing needs preparation.
                            </Card.Content>
                            <Card.Content extra>
                              <Icon name="shop"/>
                              <span>
                                I'd like {' '}
                                <Dropdown inline options={dormNumOptions}
                                  onChange={this.handleDorm}
                                  defaultValue={dormNumOptions[0].value}
                                />dorm packages ($6)
                              </span>
                            </Card.Content>
                          </Card>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  <br />
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Summary>
                        <Card centered fluid>
                          {/* <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Q8v5MrzTAwShGf4JIT57AswNzO3wqaUWMFYRLTDxgdhGti5r' /> */}
                          <Card.Content header='Cooking Package' />
                          <Card.Content>
                            Our cooking package is $6 and includes food that, well...can be cooked! It is heavy on vegetables and has none of the items in the dorm package.
                          </Card.Content>
                          <Card.Content extra>
                            <Icon name="shop"/>
                            <span>
                              I'd like {' '}
                              <Dropdown inline options={cookNumOptions}
                                onChange={this.handleCook}
                                defaultValue={cookNumOptions[0].value}
                              />cooking packages ($6)
                            </span>
                          </Card.Content>
                        </Card>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  {/* <Segment compact>
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
                    <p>Available deliveries left: {this.props.appReducers.availableDeliveriesLeft}</p>
                  </Segment> */}
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
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Summary>
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
                            {this.props.appReducers.ballotsAndVotes.map((ballotAndVote) => {
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
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
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
                          // Note: you can change the event to `onClick`, `onClick`, `onTouchStart`
                          // useful if you're using React-Tap-Event-Plugin
                          triggerEvent="onClick"
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
    );
  }
}

export default Payment;
