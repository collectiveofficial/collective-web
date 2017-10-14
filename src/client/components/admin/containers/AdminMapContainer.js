import React from 'react';
import AdminMap from '../AdminMap.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActionCreators from '../../../action-creators/admin/adminActions.js';

const mapStateToProps = (state) => {
  return {
    adminReducers: state.adminReducers,
  };
};

const bundledActionCreators = Object.assign({},
  adminActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AdminMap);
