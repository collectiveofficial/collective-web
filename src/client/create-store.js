import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './reducers/appReducers.js';
import * as loginReducers from './reducers/loginReducers';
import * as registerReducers from './reducers/registerReducers';
import * as signUpReducers from './reducers/signUpReducers';
import * as homeReducers from './reducers/homeReducers';
import * as paymentReducers from './reducers/paymentReducers';
import * as votingReducers from './reducers/votingReducers';
import adminReducers from './reducers/adminReducers.js';

export default function (data) {
  // const appReducer = combineReducers(appReducers);
  const loginReducer = combineReducers(loginReducers);
  const registerReducer = combineReducers(registerReducers);
  const signUpReducer = combineReducers(signUpReducers);
  const homeReducer = combineReducers(homeReducers);
  const paymentReducer = combineReducers(paymentReducers);
  const votingReducer = combineReducers(votingReducers);
  const reducers = {
    appReducers,
    loginReducer,
    registerReducer,
    signUpReducer,
    homeReducer,
    paymentReducer,
    votingReducer,
    adminReducers,
  };
  const rootReducer = combineReducers(reducers);
  // console.log('REDUCER: ', reducer);
  // In case we want to have middlewares later
  const finalCreateStore = applyMiddleware(thunk)(createStore);
  const store = finalCreateStore(rootReducer, data,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  // const store = createStore(rootReducer, data,
  //  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  return store;
}
