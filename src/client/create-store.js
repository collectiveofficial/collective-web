import { createStore, /* applyMiddleware, */ combineReducers } from 'redux'
import * as appReducers from './reducers/appReducers' // TODO CHANGE
import * as loginReducers from './reducers/loginReducers'
import * as registerReducers from './reducers/registerReducers'
import * as signUpReducers from './reducers/signUpReducers'
import * as homeReducers from './reducers/homeReducers'
import * as paymentReducers from './reducers/paymentReducers'
import * as votingReducers from './reducers/votingReducers'


export default function(data) {
  var appReducer = combineReducers(appReducers);
  var loginReducer = combineReducers(loginReducers);
  var registerReducer = combineReducers(registerReducers);
  var signUpReducer = combineReducers(signUpReducers);
  var homeReducer = combineReducers(homeReducers);
  var paymentReducer = combineReducers(paymentReducers);
  var votingReducer = combineReducers(votingReducers);
  var reducers = {
    appReducer,
    loginReducer,
    registerReducer,
    signUpReducer,
    homeReducer,
    paymentReducer,
    votingReducer
  };
  var reducer = combineReducers(reducers)
  // console.log('REDUCER: ', reducer);
  // In case we want to have middlewares later
  // var finalCreateStore = applyMiddleware(promiseMiddleware)(createStore)
  // var store = finalCreateStore(reducer, data)
  var store = createStore(reducer, data,
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  return store;
}
