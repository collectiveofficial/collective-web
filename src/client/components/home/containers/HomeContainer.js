// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as homeActionCreators from '../../../action-creators/home/homeActions'
import Home from '../Home.js';

const mapStateToProps = (state) => {
  return {
    homeReducers: state.homeReducers,
  };
};

const bundledActionCreators = Object.assign({},
  homeActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
