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
          <div className={s.card}>
            <h2>Collective makes healthy food easy</h2>
            <div className={s.infoCont}>
              <div className={s.info}>We believe that the food system is too big, too inefficient, and too unsustainable to feed people in the way they want. So we help to easily connect independent groups to local sources, allowing consumers to empower themselves through high quality, cheap produce. By cutting out the middleman and getting back to the community, we can provide farmer's market quality at convenience store price. You just buy into our $6 or $10 packages, and we help to give you a box full of amazing food.</div>
              <Image src='https://static1.squarespace.com/static/54ebb77ce4b05bee3a09f904/t/54ebbe9fe4b08f2aaf3f6563/1424735908416/FM.jpg?format=1500w' />
           </div>
         </div>
       </div>
    );
  }
}

export default about;
