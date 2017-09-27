import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import s from './foodwiki.css';

const FoodWiki = () => (
  <div>
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.card}>
          Thanks for checking out our food wiki page! We are currently building it to be a fantastic resource for anyone to look up instructions on recipes, food preparation, and storage. We will keep you updated on when this is fully functional.
        <br />
        <br />
          For now, check out these links which can provide decent resources about any recipe related questions you may have: <a href="https://www.supercook.com" target="/blank">www.supercook.com</a>, <a href="https://www.food2fork.com" target="/blank">food2fork.com</a>, <a href="https://www.allrecipes.com" target="/blank">allrecipes.com</a>, and <a href="https://www.food.com" target="/blank">food.com</a>.
        <br />
        <br />
          As for storage and preparation, there are a few rules you can easily follow to help make sure that your food is clean and good to eat.
        <br />
          1. Be careful of any produce with mold, bruises, or cuts. Wash all produce before and keep them away from any raw meat, seafood, polutry or eggs.
        <br />
          2. Store your produce in a fridge set to 40 degrees of lower. Refrigerate apples, cantaloupes, figs, plums, kiwis, apricots, honey dews, cauliflower, lettuce, cucumbers, cabbage, brussel sprouts and broccoli. Don't refrigerate peaches, avocadoes, bananas, watermelons, tomatoes, and nectarines. Never refrigerate potatoes, onions, winter squash, or garlic. Instead, keep those in a cool, dark, dry area.
        <br />
          3. Certain foods release a gas called ethylene that causes food to ripen, and rot, quicker. So, in order to keep your produce for as long as possible, be careful of gas sensitive and gas releasing produce. Gas sensitive produce includes bananas, broccoli, brussel sprouts, cabbage, carrots, cauliflower, cucumbers, eggplant, lettuce, peas, peppers, squash, sweet potatoes, and watermelon. Gas releasing produce includes apples, apricots, cantaloupe, figs, honeydew, kiwi, plums, avocadoes, bananas, nectarines, peaches, and tomatoes.
        </div>
      </div>
    </div>
</div>
);

export default FoodWiki;
