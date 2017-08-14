import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './Home.css';
import { Card, Icon, Image, Checkbox, Popup, Dropdown, Feed, Modal, Header, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

// const successPayment = data => {
//   alert('Payment Successful');
// };
//
// const errorPayment = data => {
//   alert('Payment Error');
// };
//
// onToken = (amount, description) => token =>
//   axios.post("https://checkout.stripe.com/checkout.js",
//     {
//       description,
//       source: token.id,
//       currency: 'USD',
//       amount: fromEuroToCent(amount)
//     })
//     .then(successPayment)
//     .catch(errorPayment);
//
//   <StripeCheckout
//     name={name}
//     description={description}
//     token={onToken(amount, description)}
//   />
//   <StripeCheckout
//     name="Best Food Forward/Collective"
//     description="Easy healthy eating"
//     ComponentClass="div"
//     amount={this.state.price * 100 + 50}
//     currency="USD"
//     stripeKey="pk_test_o6trMS2lojkAKMM0HbRJ0tDI"
//     email="bestfoodforward@osu.edu"
//     shippingAddress
//     billingAddress={false}
//     zipCode={false}
//     allowRememberMe
//     token={this.onToken}
//     opened={this.onOpened}
//     closed={this.onClosed}
//     reconfigureOnUpdate={false}
//     triggerEvent="onTouchTap"
//     >


const numOptions = [
  {text: "0", value: "0"},
  {text: "1", value: "1"},
  {text: "2", value: "2"},
  {text: "3", value: "3"},
  {text: "4", value: "4"},
  {text: "5", value: "5"},
  {text: "6", value: "6"},
  {text: "7", value: "7"}
];

const foodMaster = {Apples: "https://newenglandapples.files.wordpress.com/2014/10/img_5595.jpg",
Bananas: "https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?w=720",
Mangos: "http://www.multivu.com/players/English/72762525-MCI-eyes-revolution-mango-trade/gallery//image/b07adc25-5812-4dfd-aac3-3373579d586c.jpg",
SweetPotatoes: "https://i2.wp.com/bonnieplants.com/wp-content/uploads/2011/10/sweet-potatoes-harvest.jpg?ssl=1",
Pears: "http://www.canned-fresh.com/live/media/2012/02/pears2.jpg",
Potatoes: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
Kiwis: "http://cdn.thealternativedaily.com/wp-content/uploads/2013/11/kiwi.jpg",
Oranges: "http://grapplergourmet.com/wp-content/uploads/2015/03/piles.jpg",
Avocadoes: "http://jenknoedl.com/wp-content/uploads/2015/11/20150115-avocados-brown-1.jpg",
GrannySmithApples: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Granny_smith.jpg/220px-Granny_smith.jpg",
GoldenDeliciousApples: "https://sc01.alicdn.com/kf/UT88x55XFFaXXagOFbXL/Golden-Delicious-Apples-Best-Quality-and-best.jpg",
PinkLadyApples: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQafjY4RXhQCk40caqUGSRtmzkK0hu_RQQ_zR1v3nWAkRSvvSgTsA",
RedGrapes: "https://blackmoonejuice.com/wp-content/uploads/2014/05/grapes.jpg",
WhiteGrapes: "http://world-food-and-wine.com/image-files/white-grapes.jpg",
Carrots: "https://edge.alluremedia.com.au/uploads/businessinsider/2015/12/baby-carrots.jpg",
Spinach: "http://healthyrise.com/wp-content/uploads/2016/07/Spinach.jpg",
RedPeppers: "http://www.ibizeneco.com/communities/1/004/013/082/201/images/4621089873.jpg",
GreenPeppers: "http://palmaworld.com/wp-content/uploads/2017/01/green-pepper.jpg"
}

class Voting extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
      modalIsOpen: false,
      condition: false,
      items: [['Sweet Potatoes', false],
      ['Potatoes', false],
      ['Kiwis', false],
      ['Oranges', false],
      ['Granny Smith Apples', false],
      ['Golden Delicious Apples', false],
      ['Pink Lady Apples', false],
      ['Bananas', false],
      ['Red Grapes', false],
      ['White Grapes', false],
      ['Carrots', false],
      ['Spinach', false],
      ['Red Peppers', false],
      ['Green Peppers', false]
    ],
      votes: 6,
      consensus: {SweetPotatoes: false,
      Potatoes: false,
      Kiwis: false,
      Oranges: false,
      GrannySmithApples: false,
      GoldenDeliciousApples: false,
      PinkLadyApples: false,
      Bananas: false,
      RedGrapes: false,
      WhiteGrapes: false,
      Carrots: false,
      Spinach: false,
      RedPeppers: false,
      GreenPeppers: false
    },
      price: 0
    };
    // this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDorm = this.handleDorm.bind(this);
    this.handleCook = this.handleCook.bind(this);
    this.onToken = this.onToken.bind(this);
}
    onChange(event){

    }
    handleChange(e, { value, checked }) {
      if(this.state.votes >= 0){
        if(checked) {
          const add = this.state.consensus;
          add[value] = true;
          this.setState({consensus: add});
          var newVote = this.state.votes;
          newVote = newVote - 1;
          this.setState({votes: newVote});
        } else {
          const del = this.state.consensus;
          del[value] = false;
          this.setState({consensus: del});
          var newVote = this.state.votes;
          newVote = newVote + 1;
          this.setState({votes: newVote});
        }
      }
      console.log(this.state.consensus);
      console.log(this.state.vote);
    }

    handleDorm(e, { value }) {
      var newPrice = this.state.price;
      newPrice = newPrice + (value * 6);
      this.setState({price: newPrice});
    }
    handleCook(e, { value }) {
      var newPrice = this.state.price;
      newPrice = newPrice + (value * 10);
      this.setState({price: newPrice});
    }
    handleClick() {
      this.setState({condition: !this.state.condition});
    };

    onToken(token) {
      fetch('/save-stripe-token', {
        method: 'POST',
        body: JSON.stringify(token),
      }).then(response => {
        response.json().then(data => {
          alert(`We are in business, ${data.email}`);
        });
      });
    };
  render () {
      return (
        <div>
          <div className={s.cont}>
                  {/* <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      contentLabel="Example Modal">
                      <div className={s.flexcontainer}>
                        {this.props.items.map((x) => (
                          <ToggleButton food={x} />
                      ))}
                      </div>
                      </Modal> */}
                      <h1 className={s.top}>You have {this.state.votes} votes left</h1>
                      <div className={s.flexcontainer}>

                        {this.state.items.map((x) => (
                          // <ToggleButton food={x} />
                          <div className={s.ballot}>
                          <Card>
                            <Image src={foodMaster[x[0].split(' ').join('')]} />
                            <Card.Content>
                              <Card.Header>
                                {x[0]}
                              </Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                              <Checkbox toggle
                                value={x[0].split(' ').join('')}
                                onChange={this.handleChange}/>

                            </Card.Content>
                          </Card>
                        </div>
                        ))}
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
                                      Total = ${this.state.price} + $.50 transaction fee
                                    </Feed.Summary>
                                  </Feed.Content>
                                </Feed.Event>
                                <br />
                                <Feed.Event>
                                  <Feed.Content>
                                    <Feed.Summary>
                                      <StripeCheckout
                                        name="Best Food Forward/Collective" // the pop-in header title
                                        description="Easy healthy eating" // the pop-in header subtitle
                                        ComponentClass="div"
                                        // panelLabel="Give Money" prepended to the amount in the bottom pay button
                                        amount={this.state.price * 100 + 50} // cents
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
                                    </Feed.Summary>
                                  </Feed.Content>
                                </Feed.Event>
                              </Feed>
                            </Card.Content>
                          </Card>
                        </div>
                      </div>
              </div>
          </div>
      )
  }
}

export default Voting;
