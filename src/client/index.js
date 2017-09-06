import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './create-store'
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//
//   let createClass = React.createClass;
//   Object.defineProperty(React, 'createClass', {
//     set: (nextCreateClass) => {
//       createClass = nextCreateClass;
//     }
//   });
//
//   whyDidYouUpdate(React);
// }
const store = createStore();
const history = createBrowserHistory();
const AppAvoid = withRouter(App); // React Route + connect() bug
ReactDOM.render((
  <Provider store={ store }>
    <Router history={history}>
      <AppAvoid/>
    </Router>
  </Provider>
), document.getElementById('root'));
