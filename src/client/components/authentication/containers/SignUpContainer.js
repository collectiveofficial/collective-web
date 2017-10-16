// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as appActionCreators from '../../../action-creators/app/appActions';
import * as loginActionCreators from '../../../action-creators/loginActions';
import * as signUpActionCreators from '../../../action-creators/signUpActions';
import SignUp from '../SignUp.js';

const mapStateToProps = (state) => {
  return {
    appReducers: state.appReducers,

    // loginReducers
    emailInput: state.loginReducer._emailInput,
    passwordInput: state.loginReducer._passwordInput,
    isEmailValidated: state.loginReducer._isEmailValidated, // TODO RENAME
    isPasswordValidated: state.loginReducer._isPasswordValidated,
    emailErrorMessage: state.loginReducer._emailErrorMessage,
    passwordErrorMessage: state.loginReducer._passwordErrorMessage,

    // signUpReducers
    isWeakPassword: state.signUpReducer._isWeakPassword,
    isEmailAlreadyInUse: state.signUpReducer._isEmailAlreadyInUse,
    isExistingUserFBAuth: state.signUpReducer._isExistingUserFBAuth,
  }
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  loginActionCreators,
  signUpActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
