// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as contactActionCreators from '../../../action-creators/contact/contactActions'
import Contact from '../Contact.js';

const mapStateToProps = (state) => {
  return {
    contactReducers: state.contactReducers,
  };
};

const bundledActionCreators = Object.assign({},
  contactActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
