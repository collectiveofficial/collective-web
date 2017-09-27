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
      return initialEmailInputState
    }
  switch (action.type) {

    case 'SET_EMAIL_INPUT':
      return action.text;

    default:
      return state
  }
}

export function _passwordInput(state=initialPasswordInputState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE','ENTER_SIGNUP_PAGE'].includes(action.type)) {
      return initialPasswordInputState
    }
  switch (action.type) {

    case 'SET_PASSWORD_INPUT':
      return action.text;

    default:
      return state
  }
}

export function _isEmailValidated(state=initialIsEmailValidatedState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
      return initialIsEmailValidatedState
    }
  switch (action.type) {

    case 'SET_IS_EMAIL_VALIDATED':
      return action.text;

    default:
      return state
  }
}

export function _isPasswordValidated(state=initialIsPasswordValidatedState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
      return initialIsPasswordValidatedState
    }
  switch (action.type) {

    case 'SET_IS_PASSWORD_VALIDATED':
      return action.text;

    default:
      return state
  }
}

export function _isWrongPassword(state=initialIsWrongPasswordState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
      return initialIsWrongPasswordState
    }
  switch (action.type) {

    case 'SET_IS_WRONG_PASSWORD':
      return action.text;

    default:
      return state
  }
}

export function _isUserDisabled(state=initialIsUserDisabledState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE'].includes(action.type)) {
      return initialIsUserDisabledState
    }
  switch (action.type) {

    case 'SET_IS_USER_DISABLED':
      return action.text;

    default:
      return state
  }
}

export function _isUserNotFound(state=initialIsUserNotFoundState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE'].includes(action.type)) {
      return initialIsUserNotFoundState
    }
  switch (action.type) {

    case 'SET_IS_USER_NOT_FOUND':
      return action.text;

    default:
      return state
  }
}

export function _emailErrorMessage(state=initialEmailErrorMessageState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
      return initialEmailErrorMessageState
    }
  switch (action.type) {

    case 'SET_EMAIL_ERROR_MSG':
      return action.text;

    default:
      return state
  }
}

export function _passwordErrorMessage(state=initialPasswordErrorMessageState, action) {
  if (['LOGOUT','ENTER_LOGIN_PAGE', 'RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE','RESET_LOGIN_ERROR_STATES'].includes(action.type)) {
      return initialPasswordErrorMessageState
    }
  switch (action.type) {

    case 'SET_PASSWORD_ERROR_MSG':
      return action.text;

    default:
      return state
  }
}
