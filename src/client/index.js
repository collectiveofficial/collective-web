import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import createStore from './create-store.js';
import AppContainer from './AppContainer.js';
import createBrowserHistory from 'history/createBrowserHistory';

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
const AppAvoid = withRouter(AppContainer); // React Route + connect() bug
injectTapEventPlugin();
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <AppAvoid />
    </Router>
  </Provider>
), document.getElementById('root'));
