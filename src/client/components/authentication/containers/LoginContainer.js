// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as appActionCreators from '../../../action-creators/app/appActions.js';
import * as loginActionCreators from '../../../action-creators/loginActions';
import Login from '../../authentication/Login.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,

    // loginReducers
    emailInput: state.loginReducer._emailInput,
    passwordInput: state.loginReducer._passwordInput,
    isEmailValidated: state.loginReducer._isEmailValidated,
    isPasswordValidated: state.loginReducer._isPasswordValidated,
    isWrongPassword: state.loginReducer._isWrongPassword,
    emailErrorMessage: state.loginReducer._emailErrorMessage,
    isUserDisabled: state.loginReducer._isUserDisabled,
    isUserNotFound: state.loginReducer._isUserNotFound,
    passwordErrorMessage: state.loginReducer._passwordErrorMessage,
  }
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  loginActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
