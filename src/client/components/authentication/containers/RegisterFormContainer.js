// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as loginActionCreators from '../../../action-creators/loginActions';
import * as registerActionCreators from '../../../action-creators/registerActions';
import RegisterForm from '../RegisterForm.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,

    // loginReducers
    emailInput: state.loginReducer._emailInput,
    passwordInput: state.loginReducer._passwordInput,

    //registerReducers
    firstName: state.registerReducer._firstName,
    lastName: state.registerReducer._lastName,
    phoneNumber: state.registerReducer._phoneNumber,
    birthday: state.registerReducer._birthday,
    streetAddress: state.registerReducer._streetAddress,
    aptSuite: state.registerReducer._aptSuite,
    city: state.registerReducer._city,
    state: state.registerReducer._state,
    zipCode: state.registerReducer._zipCode,
    isFirstNameEmpty: state.registerReducer._isFirstNameEmpty,
    isLastNameEmpty: state.registerReducer._isLastNameEmpty,
    isPhoneNumberEmpty: state.registerReducer._isPhoneNumberEmpty,
    isBirthdayEmpty: state.registerReducer._isBirthdayEmpty,
    isStreetAddressEmpty: state.registerReducer._isStreetAddressEmpty,
    isCityEmpty: state.registerReducer._isCityEmpty,
    isStateEmpty: state.registerReducer._isStateEmpty,
    isZipCodeEmpty: state.registerReducer._isZipCodeEmpty,
    areThereEmptyFields: state.registerReducer._areThereEmptyFields,
    isInvalidState: state.registerReducer._isInvalidState,
    isInvalidSchool: state.registerReducer._isInvalidSchool,
    isFakeAddress: state.registerReducer._isFakeAddress,
    school: state.registerReducer._school,
    isSchoolEmpty: state.registerReducer._isSchoolEmpty
  }
};

const bundledActionCreators = Object.assign({},
  loginActionCreators,
  registerActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
