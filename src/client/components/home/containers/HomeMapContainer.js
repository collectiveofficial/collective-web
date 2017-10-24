// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as homeActionCreators from '../../../action-creators/home/homeActions'
import HomeMap from '../HomeMap.js';

const mapStateToProps = (state) => {
  return {
    homeReducers: state.homeReducers,
  };
};

const bundledActionCreators = Object.assign({},
  homeActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomeMap);
