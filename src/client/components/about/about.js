import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './about.css';
import { Icon, Popup, List, Image } from 'semantic-ui-react';

class about extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <div className={s.root}>
          <div className={s.flexcontainer}>
          <div className={s.card}>
            <h2>Collective makes healthy food easy</h2>
            <div className={s.infoCont}>
              <div className={s.info}>We believe that the food system is too big, too inefficient, and too unsustainable to feed people in the way they want. So we help to easily connect independent groups to local sources, allowing consumers to empower themselves through high quality, cheap produce. By cutting out the middleman and getting back to the community, we can provide farmer's market quality at convenience store price. You just buy into our $6 or $10 packages, and we help to give you a box full of amazing food.</div>
              <Image src='https://static1.squarespace.com/static/54ebb77ce4b05bee3a09f904/t/54ebbe9fe4b08f2aaf3f6563/1424735908416/FM.jpg?format=1500w' />
           </div>
         </div>
         <div className={s.card}>
           <h2 className={s.head}>How it works</h2>
           <List>
             <List.Item>
               <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17807497_1005883922845608_8912956886368631568_o.jpg?oh=6f07d42171594a4f73740bceee2962b7&oe=59EADBED' />
               <List.Content>
                 <List.Header>Vote</List.Header>
                 <List.Description>You vote and pay for the food you want</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17854651_1005883912845609_4293592665208382319_o.jpg?oh=f0353b293d6f89d1b233eb0cc6e02a1a&oe=59EBC6F0' />
               <List.Content>
                 <List.Header>Organize</List.Header>
                 <List.Description>We compile votes, pool money, and then send everything back to independent organizers</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17855598_1005883899512277_3945066174219173922_o.jpg?oh=5a1f7d848a4efb9510a036481493bbf5&oe=59F30798' />
               <List.Content>
                 <List.Header>Source</List.Header>
                 <List.Description>Organizing groups buy the food directly from local sources</List.Description>
               </List.Content>
             </List.Item>
           </List>
           <List>
             <List.Item>
               <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17880057_1005883869512280_2672757500595292705_o.jpg?oh=d896a7760c7feae53fd6dac05e9403db&oe=59F61E1A' />
               <List.Content>
                 <List.Header>Community</List.Header>
                 <List.Description>And then we work together to bring the bulk food to you, all for around half the cost of the grocery store</List.Description>
               </List.Content>
             </List.Item>
           </List>
         </div>
         <div className={s.card}>
           <h2 className={s.head}>Why it works</h2>
           <div className={s.infoCont}>
             <div className={s.info}>Our current food system relies on an inefficient supply chain that continually adds unnecessary costs to the food you end up buying. On top of that, grocery stores have become wasteful and inefficient. Even though you buy the same 30-40 products every single time you go to the store, you have to pay extra just to support the 10,000 other products that you have no interest in. And because grocery stores have to bet on what consumers are going to buy, they end up having to throw out billions of pounds of unbought food each year. By cutting out the middle man, and only providing the most ripe and healthy food, we ensure that our users are able to eat healthy for very little cost all while contributing to a more sustainable, low-waste food system.</div>
             </div>
         </div>
         <div className={s.card}>
           <h2 className={s.head}>Why we're better</h2>
           <div className={s.infoCont}>
             <div className={s.info}>We understand that many users have tons of options for where they can buy their groceries, we are certain that Collective is the best way. We are low cost and low waste and we work to support community farms and food organizers rather than to take them over. All across the baord, you can see companies like Amazon, Whole Foods, and Wal-Mart, who are monopolizing the food industry by taking over farms and setting predatory prices. Not only can they not meet our low prices or our sustainability, they don't work to empower community food systems like our communal purchasing system does. So if you are concerned about sustainability, waste, community, Collective is the only way to go.</div>
           </div>
         </div>
       </div>
     </div>
    );
  }
}

export default about;
