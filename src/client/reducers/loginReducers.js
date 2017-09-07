var initialEmailInputState = '';
var initialPasswordInputState = '';
var initialIsEmailValidatedState = '';
var initialIsPasswordValidatedState = '';
var initialIsWrongPasswordState = '';
var initialIsUserDisabledState = '';
var initialIsUserNotFoundState = '';
var initialEmailErrorMessageState = '';
var initialPasswordErrorMessageState = '';

export function _emailInput(state=initialEmailInputState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'ENTER_SIGNUP_PAGE'].includes(action.type)) {
  console.log('_emailInput state called with state: ', state, 'and action: ', action);
      return initialEmailInputState
    }
  switch (action.type) {

    case 'SET_EMAIL_INPUT':
      console.log('_emailInput state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _passwordInput(state=initialPasswordInputState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE','ENTER_SIGNUP_PAGE'].includes(action.type)) {
  console.log('_passwordInput state called with state: ', state, 'and action: ', action);
      return initialPasswordInputState
    }
  switch (action.type) {

    case 'SET_PASSWORD_INPUT':
      console.log('_passwordInput state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isEmailValidated(state=initialIsEmailValidatedState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
  console.log('_isEmailValidated state called with state: ', state, 'and action: ', action);
      return initialIsEmailValidatedState
    }
  switch (action.type) {

    case 'SET_IS_EMAIL_VALIDATED':
      console.log('_isEmailValidated state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isPasswordValidated(state=initialIsPasswordValidatedState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
  console.log('_isPasswordValidated state called with state: ', state, 'and action: ', action);
      return initialIsPasswordValidatedState
    }
  switch (action.type) {

    case 'SET_IS_PASSWORD_VALIDATED':
      console.log('_isPasswordValidated state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isWrongPassword(state=initialIsWrongPasswordState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
  console.log('_isWrongPassword state called with state: ', state, 'and action: ', action);
      return initialIsWrongPasswordState
    }
  switch (action.type) {

    case 'SET_IS_WRONG_PASSWORD':
      console.log('_isWrongPassword state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isUserDisabled(state=initialIsUserDisabledState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE'].includes(action.type)) {
  console.log('_isUserDisabled state called with state: ', state, 'and action: ', action);
      return initialIsUserDisabledState
    }
  switch (action.type) {

    case 'SET_IS_USER_DISABLED':
      console.log('_isUserDisabled state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isUserNotFound(state=initialIsUserNotFoundState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE'].includes(action.type)) {
  console.log('_isUserNotFound state called with state: ', state, 'and action: ', action);
      return initialIsUserNotFoundState
    }
  switch (action.type) {

    case 'SET_IS_USER_NOT_FOUND':
      console.log('_isUserNotFound state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _emailErrorMessage(state=initialEmailErrorMessageState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
  console.log('_emailErrorMessage state called with state: ', state, 'and action: ', action);
      return initialEmailErrorMessageState
    }
  switch (action.type) {

    case 'SET_EMAIL_ERROR_MSG':
      console.log('_emailErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _passwordErrorMessage(state=initialPasswordErrorMessageState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
  console.log('_passwordErrorMessage state called with state: ', state, 'and action: ', action);
      return initialPasswordErrorMessageState
    }
  switch (action.type) {

    case 'SET_PASSWORD_ERROR_MSG':
      console.log('_passwordErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}
