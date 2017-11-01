// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as landingActionCreators from '../../../action-creators/landing/landingActions'
import Landing from '../Landing.js';

const mapStateToProps = (state) => {
  return {
    landingReducers: state.landingReducers,
  };
};

const bundledActionCreators = Object.assign({},
  landingActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
