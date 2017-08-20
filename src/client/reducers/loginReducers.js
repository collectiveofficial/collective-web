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
  switch (action.type) {
    case 'SET_EMAIL_INPUT':
      console.log('_emailInput state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _passwordInput(state=initialPasswordInputState, action) {
  switch (action.type) {
    case 'SET_PASSWORD_INPUT':
      console.log('_passwordInput state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isEmailValidated(state=initialIsEmailValidatedState, action) {
  switch (action.type) {
    case 'SET_IS_EMAIL_VALIDATED':
      console.log('_isEmailValidated state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isPasswordValidated(state=initialIsPasswordValidatedState, action) {
  switch (action.type) {
    case 'SET_IS_PASSWORD_VALIDATED':
      console.log('_isPasswordValidated state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isWrongPassword(state=initialIsWrongPasswordState, action) {
  switch (action.type) {
    case 'SET_IS_WRONG_PASSWORD':
      console.log('_isWrongPassword state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isUserDisabled(state=initialIsUserDisabledState, action) {
  switch (action.type) {
    case 'SET_IS_USER_DISABLED':
      console.log('_isUserDisabled state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isUserNotFound(state=initialIsUserNotFoundState, action) {
  switch (action.type) {
    case 'SET_IS_USER_NOT_FOUND':
      console.log('_isUserNotFound state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _emailErrorMessage(state=initialEmailErrorMessageState, action) {
  switch (action.type) {
    case 'SET_EMAIL_ERROR_MSG':
      console.log('_emailErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _passwordErrorMessage(state=initialPasswordErrorMessageState, action) {
  switch (action.type) {
    case 'SET_PASSWORD_ERROR_MSG':
      console.log('_passwordErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}
