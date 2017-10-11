import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddBulkBuyConfirmation from './AddBulkBuyConfirmation.js';
import * as adminActionCreators from '../../action-creators/admin/adminActions.js';

const mapStateToProps = (state) => {
  return {
    adminReducers: state.adminReducers,
  };
};

const bundledActionCreators = Object.assign({},
  adminActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddBulkBuyConfirmation);
