import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Home.css';
import { Card, Icon, Image, Checkbox, Popup, Dropdown, Feed, Modal, Header, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';

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
    };

    this.handleDorm = this.handleDorm.bind(this);
    this.handleCook = this.handleCook.bind(this);
    this.onToken = this.onToken.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
  }


  handleDorm(e, { value }) {
    var newPrice = this.state.price;
    newPrice = newPrice + (value * 6);
    this.setState({ price: newPrice });
  }

  handleCook(e, { value }) {
    var newPrice = this.state.price;
    newPrice = newPrice + (value * 10);
    this.setState({ price: newPrice });
  }

  async handlePayment() {
    await this.setState({ paymentErrorMessage: '' });
    if (this.state.price === 0) {
      await this.setState({ paymentErrorMessage: 'Please specify an amount for the packages.' });
    }
    if (this.state.price > 0) {
      // let modal open
    }
  }

  onToken(token) {
    fetch('/save-stripe-token', {
      method: 'POST',
      body: JSON.stringify(token),
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`);
      });
    });
  }

  render() {
    const styles = {
      stripe: {
        visibility: 'hidden',
      },
    };

    return (
      <div>
        <div className={s.cont}>
          {/* <Link to="/payment" className={s.butt}><Button>Submit and Pay</Button></Link> */}
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
                          /><Modal trigger={<div className={s.mode}>cooking packages</div>} basic size='small' >
                            <Modal.Header>Cooking package</Modal.Header>
                            <Modal.Content image>
                              <Modal.Description>
                                <p>Our cooking package is $10 and includes food that, well...can be cooked! (:</p>
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
                        Total = ${this.state.price}
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                  <br />


                  <Popup
                    trigger={<Feed.Event onClick={this.handlePayment}>
                      <Feed.Content>
                        <Feed.Summary>
                          <RaisedButton label="Pay With Card" primary={true} onClick={this.handlePayment} >
                            {this.state.price > 0 ?
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
                              :
                              <div>Pay with Card</div>
                            }
                          </RaisedButton>
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
      </div>
    )
  }
}

export default Payment;
