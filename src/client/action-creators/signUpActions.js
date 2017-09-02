// export const SET_EMAIL_INPUT = 'SET_EMAIL_INPUT'; // Already in loginActions.js
// export const SET_PASSWORD_INPUT = 'SET_PASSWORD_INPUT'; // Already in loginActions.js
// export const SET_IS_EMAIL_VALIDATED = 'SET_IS_EMAIL_VALIDATED'; // Already in loginActions.js
// export const SET_IS_PASSWORD_VALIDATED = 'SET_IS_PASSWORD_VALIDATED'; // Already in loginActions.js
export const SET_IS_WEAK_PASSWORD = 'SET_IS_WEAK_PASSWORD';
export const SET_IS_EMAIL_ALREADY_IN_USE = 'SET_IS_EMAIL_ALREADY_IN_USE';
export const SET_IS_EXISTING_USER_FB_AUTH = 'SET_IS_EXISTING_USER_FB_AUTH';
export const ENTER_SIGNUP_PAGE = 'ENTER_SIGNUP_PAGE';

// export const SET_EMAIL_ERROR_MSG = 'SET_EMAIL_ERROR_MSG'; // Already in loginActions.js
// export const SET_PASSWORD_ERROR_MSG = 'SET_PASSWORD_ERROR_MSG'; // Already in loginActions.js

export function setIsWeakPassword(text) {
  return { type: SET_IS_WEAK_PASSWORD, text }
}

export function setIsEmailAlreadyInUse(text) {
  return { type: SET_IS_EMAIL_ALREADY_IN_USE, text }
}

export function setIsExistingUserFBAuth(bool) {
  return { type: SET_IS_EXISTING_USER_FB_AUTH, bool }
}

export function enterSignupPage() {
  return { type: ENTER_SIGNUP_PAGE }
}
