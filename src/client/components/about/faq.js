import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './about.css';
import { Icon, Popup, List, Image } from 'semantic-ui-react';

class faq extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className={s.rooter}>
          <div className={s.flexcontainer}>
         <div className={s.card}>
           <h2 className={s.head}>Frequently Asked Questions</h2>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>How do I vote?</List.Header>
                 <List.Description>Just create an account and then login. This will direct you to our home page that has all of our dates for upcoming bulk buys. To vote for that week, just hit vote now. Place your votes on that page then pay on the page after.</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>Why is it voting based and how long can I vote?</List.Header>
                 <List.Description>We can save the most money and waste the least food if we can get everyone to roughly "agree" on what to buy. By doing this we don't have to "bet" on what foods will be bought like a grocery store does. Instead we jsut provide the highest quality food for the lowest possible price.</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>Why pickups and can I pickup at another time?</List.Header>
                 <List.Description>Our deliveries and pickups are volunteer run. So we don't currently have the resources to provide extra pickup windows. So when ordering, it is helpful if you can ensure that you (or a friend) can pick up at the set time. If you aren't able to pickup within 30 minutes of the dropoff we will be forced to donate the food to our charitable partners.</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>What's a dorm bag and what's a cooking bag?</List.Header>
                 <List.Description>We break up our orders into two options: a dorm bag, and a cooking bag. Dorm bag foods are fruit heavy and require no cooking. Our past dorm packages included 6 apples, 1 pound of carrots, 4 bananas, 6 kiwis, 1.5 lbs of grapes, and 5 oranges. Our cooking package is built for off-campus residents and is determined by uservote and nutrient quality. To give you an idea, a package in the past has included 3 sweet potatoes, 1 lb mini peppers, 1 lb tomatoes, 2 onions, 2 potatoes, 2 limes, 0.5 lb of spinach, 1 lb baby carrots.</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>How can I check whether my order was successful?</List.Header>
                 <List.Description>If you have any questions about orders, your best bet is to refresh the page and then hit "Order Info" at the top of the header. This will automatically update and log any orders you've made in the past. If your order does not appear, we suggest retyping your information in the event that you madea typo on the first time around.</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <List.Content>
                 <List.Header>Could I get a reciept?</List.Header>
                 <List.Description>Every successful purchase will send a confirmation and reciept email to your account. On top of this, we also provide the "Order Info" page which will log all of your orders.</List.Description>
               </List.Content>
             </List.Item>
           </List>
         </div>
       </div>
     </div>
    );
  }
}

export default faq;
