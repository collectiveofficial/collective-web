// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import Header from '../Header.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,
    adminReducers: state.adminReducers,
  };
};

export default connect(mapStateToProps)(Header);
