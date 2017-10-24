// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as appActionCreators from './action-creators/app/appActions.js';
import * as adminActionCreators from './action-creators/admin/adminActions';
import * as homeActionCreators from './action-creators/home/homeActions.js';
import App from './App.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,
    adminReducers: state.adminReducers,
  };
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  adminActionCreators,
  homeActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
