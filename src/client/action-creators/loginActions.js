export const SET_EMAIL_INPUT = 'SET_EMAIL_INPUT';
export const SET_PASSWORD_INPUT = 'SET_PASSWORD_INPUT';
export const SET_IS_EMAIL_VALIDATED = 'SET_IS_EMAIL_VALIDATED';
export const SET_IS_PASSWORD_VALIDATED = 'SET_IS_PASSWORD_VALIDATED';
export const SET_IS_WRONG_PASSWORD = 'SET_IS_WRONG_PASSWORD';
export const SET_IS_USER_DISABLED = 'SET_IS_USER_DISABLED';
export const SET_IS_USER_NOT_FOUND = 'SET_IS_USER_NOT_FOUND';
export const SET_EMAIL_ERROR_MSG = 'SET_EMAIL_ERROR_MSG';
export const SET_PASSWORD_ERROR_MSG = 'SET_PASSWORD_ERROR_MSG';

export function setEmailInput(text) {
  return { type: SET_EMAIL_INPUT, text }
}

export function setPasswordInput(text) {
  return { type: SET_PASSWORD_INPUT, text }
}

export function setIsEmailValidated(text) {
  return { type: SET_IS_EMAIL_VALIDATED, text }
}

export function setIsPasswordValidated(text) {
  return { type: SET_IS_PASSWORD_VALIDATED, text }
}

export function setIsWrongPassword(text) {
  return { type: SET_IS_WRONG_PASSWORD, text }
}

export function setIsUserDisabled(text) {
  return { type: SET_IS_USER_DISABLED, text }
}

export function setIsUserNotFound(text) {
  return { type: SET_IS_USER_NOT_FOUND, text }
}

export function setEmailErrorMessage(text) {
  return { type: SET_EMAIL_ERROR_MSG, text }
}

export function setPasswordErrorMessage(text) {
  return { type: SET_PASSWORD_ERROR_MSG, text }
}
