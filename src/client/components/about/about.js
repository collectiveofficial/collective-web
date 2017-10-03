import React from 'react';
import s from './about.css';
import { List, Image } from 'semantic-ui-react';

const About = props => (
  <div className={s.root}>
    <div className={s.flexcontainer}>
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
              <List.Description>We compile votes, pool payments and then send the data back to local organizers</List.Description>
            </List.Content>
          </List.Item>
        </List>
        <List>
          <List.Item>
            <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17855598_1005883899512277_3945066174219173922_o.jpg?oh=5a1f7d848a4efb9510a036481493bbf5&oe=59F30798' />
            <List.Content>
              <List.Header>Source</List.Header>
              <List.Description>Local organizations purchase and transport the food directly from local sources</List.Description>
            </List.Content>
          </List.Item>
        </List>
        <List>
          <List.Item>
            <Image size="small" shape="circular" src='https://scontent.fsnc1-1.fna.fbcdn.net/v/t31.0-8/17880057_1005883869512280_2672757500595292705_o.jpg?oh=d896a7760c7feae53fd6dac05e9403db&oe=59F61E1A' />
            <List.Content>
              <List.Header>Enjoy</List.Header>
              <List.Description>Eat fresh and healthy bulk food that you enjoy for around half the cost of the grocery store</List.Description>
            </List.Content>
          </List.Item>
        </List>
      </div>
      <div className={s.card}>
        <h2 className={s.head}>Why it works</h2>
        <div className={s.infoCont}>
          <div className={s.info}>Grocery stores have become wasteful and inefficient. Our current food system relies on an inefficient supply chain that continually adds unnecessary costs to the food you end up buying. Even though you buy the same 30-40 products every single time you go to the store, you have to pay extra just to support the 10,000 other products that you have no interest in. Additionally, grocery stores have to bet on what consumers are going to buy, so they end up having to throw out billions of pounds of unbought food each year. By cutting out the middle man, and only providing the best quality and most nutritious food, we ensure that our users are able to eat healthy for very little cost all while contributing to a more sustainable, low-waste food system.</div>
        </div>
      </div>
      <div className={s.card}>
        <h2 className={s.head}>Why we're better</h2>
        <div className={s.infoCont}>
          <div className={s.info}>We understand that many users have plenty of options for where they can buy their groceries, we are certain that Collective is the best way. We offer a low cost and low waste solution that works to support community farms and food organizers. All across the board, you can see companies like Amazon, Whole Foods, and Wal-Mart, who are monopolizing the food industry by taking over farms and setting predatory prices. Not only can they not meet our low prices or our sustainability, they don't work to empower community food systems like our communal purchasing system does. If you are concerned about sustainability, waste, community, Collective is the only way to go.
</div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
