// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions impors
import * as appActionCreators from './action-creators/appActions';
import * as adminActionCreators from './action-creators/admin/adminActions';
import App from './App.js';

const mapStateToProps = (state) => {
  return {
    authenticated: state.appReducer._userAuthenticated, // TODO RENAME
    userAuthorized: state.appReducer._userAuthorized,
    ballotsAndVotes: state.appReducer._ballotsAndVotes,
    firebaseAccessToken: state.appReducer._firebaseAccessToken,
    loading: state.appReducer._loading,
    routeToRegisterForm: state.appReducer._routeToRegisterForm,
    userWantsEmailSignup: state.appReducer._userWantsEmailSignup,
    facebookData: state.appReducer._facebookData,
    adminReducers: state.adminReducers,
  };
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  adminActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);