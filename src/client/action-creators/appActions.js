export const SET_USER_AUTHENTICATED = 'SET_USER_AUTHENTICATED';
export const SET_USER_AUTHORIZED = 'SET_USER_AUTHORIZED';
export const SET_BALLOTS_AND_VOTES = 'SET_BALLOTS_AND_VOTES';
export const SET_FIREBASE_ACCESS_TOKEN = 'SET_FIREBASE_ACCESS_TOKEN';
export const SET_LOADING = 'SET_LOADING';
export const SET_ROUTE_TO_REGISTER_FORM = 'SET_ROUTE_TO_REGISTER_FORM';
export const SET_USER_WANTS_EMAIL_SIGNUP = 'SET_USER_WANTS_EMAIL_SIGNUP'; // TODO: MOVE TO SIGNUP
export const SET_FACEBOOK_DATA = 'SET_FACEBOOK_DATA';

export function setUserAuthenticated(bool) {
  return { type: SET_USER_AUTHENTICATED, bool }
}

export function setUserAuthorized(bool) {
  return { type: SET_USER_AUTHORIZED, bool }
}

export function setBallotsAndVotes(arr) {
  return { type: SET_BALLOTS_AND_VOTES, arr }
}

export function setFirebaseAccessToken(text) {
  return { type: SET_FIREBASE_ACCESS_TOKEN, text }
}

export function setLoading(bool) {
  return { type: SET_LOADING, bool }
}

export function setRouteToRegisterForm(bool) {
  return { type: SET_ROUTE_TO_REGISTER_FORM, bool }
}

export function setUserWantsEmailSignup(text) { // TODO: MOVE TO SIGNUP
  return { type: SET_USER_WANTS_EMAIL_SIGNUP, text }
}

export function setFacebookData(obj) {
  return { type: SET_FACEBOOK_DATA, obj }
}