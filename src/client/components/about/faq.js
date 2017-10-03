import React from 'react';
import s from './about.css';
import { List } from 'semantic-ui-react';

const Faq = props => (
  <div className={s.rooter}>
    <div className={s.flexcontainer}>
      <div className={s.card}>
        <h2 className={s.head}>Frequently Asked Questions</h2>
        <List>
          <List.Item>
            <List.Content>
              <List.Header>How do I vote?</List.Header>
              <List.Description>After agreeing to our user agreement when you create an account with us, you will be directed to our home page that has all of your local organization’s dates for the upcoming bulk buys. To vote for that week, just hit the “Vote” button on top of the page. Place your votes on that page then pay on the page after.</List.Description>
            </List.Content>
          </List.Item>
        </List>
        <List>
          <List.Item>
            <List.Content>
              <List.Header>Can I pickup at another time?</List.Header>
              <List.Description>When ordering, it is helpful if you can ensure that you (or a friend) can pick up at the designated bulk buy time. If you aren't able to pickup within 30 minutes after the ending bulk buy time, we will donate the food to our charitable partners to ensure food quality and reduce waste.</List.Description>
            </List.Content>
          </List.Item>
        </List>
        <List>
          <List.Item>
            <List.Content>
              <List.Header>What's a dorm package and what's a cooking package?</List.Header>
              <List.Description>Dorm package contents are fruit heavy and require no cooking. Our past dorm packages included 6 apples, 1 pound of carrots, 4 bananas, 6 kiwis, 1.5 lbs of grapes, and 5 oranges. Our cooking packages are built for off-campus residents. To give you an idea, a cooking package in the past has included 3 sweet potatoes, 1 lb mini peppers, 1 lb tomatoes, 2 onions, 2 potatoes, 2 limes, 0.5 lb of spinach, 1 lb baby carrots.</List.Description>
            </List.Content>
          </List.Item>
        </List>
        <List>
          <List.Item>
            <List.Content>
              <List.Header>How can I check whether my order was successful?</List.Header>
              <List.Description>A successful payment will lead you to an order success page where you can choose to return to the home page. After you have returned to the home page, refresh the page then hit "Order Info" at the top of the page. This will automatically update and log any orders you've made in the past. An order confirmation email will also be sent out to the email/Facebook email you signed up with.</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>
    </div>
  </div>
);

export default Faq;
