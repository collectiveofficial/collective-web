// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as appActionCreators from '../../../action-creators/app/appActions';
import * as adminActionCreators from '../../../action-creators/admin/adminActions';
import Header from '../Header.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,
    adminReducers: state.adminReducers,
  };
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  adminActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
