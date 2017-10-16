// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as paymentActionCreators from '../../../action-creators/paymentActions.js';
import Payment from '../Payment.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,
    // Payment reducers
    modalIsOpen: state.paymentReducer._modalIsOpenState,
    price: state.paymentReducer._price,
    paymentErrorMessage: state.paymentReducer._paymentErrorMessage,
    dorm: state.paymentReducer._dorm,
    cook: state.paymentReducer._cook,
    hasPaymentCompleted: state.paymentReducer._hasPaymentCompleted,
    votesSaved: state.paymentReducer._votesSaved,
    hasAllergies: state.paymentReducer._hasAllergies,
    paymentEmail: state.paymentReducer._paymentEmail,
    userWantsDelivery: state.paymentReducer._userWantsDelivery,
    serverPaymentErrorMessage: state.paymentReducer._serverPaymentErrorMessage,
    deliveryPriceImpact: state.paymentReducer._deliveryPriceImpact,
    allergiesList: state.paymentReducer._allergiesList
  }
};

const bundledActionCreators = Object.assign({},
  paymentActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
