var initialPasswordErrorMessageState = '';

var initialIsWeakPasswordState = '';
var initialIsEmailAlreadyInUseState = false;
var initialIsExistingUserFBAuthState = false;

export function _isWeakPassword(state=initialIsWeakPasswordState, action) {
  if (['LOGOUT','RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE'].includes(action.type)) {
      return initialIsWeakPasswordState;
    }
  switch (action.type) {
    case 'SET_IS_WEAK_PASSWORD':
      return action.text;

    default:
      return state
  }
}

export function _isEmailAlreadyInUse(state=initialIsEmailAlreadyInUseState, action) {
  if (['LOGOUT','RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE'].includes(action.type)) {
      return initialIsEmailAlreadyInUseState;
    }
  switch (action.type) {
    case 'SET_IS_EMAIL_ALREADY_IN_USE':
      return action.text;

    default:
      return state
  }
}

export function _isExistingUserFBAuth(state=initialIsExistingUserFBAuthState, action) {
  if (['LOGOUT','RESET_ERROR_MSG_STATES', 'ENTER_SIGNUP_PAGE'].includes(action.type)) {
      return initialIsExistingUserFBAuthState;
    }
  switch (action.type) {
    case 'SET_IS_EXISTING_USER_FB_AUTH':
      return action.bool;

    default:
      return state
  }
}
