import actionTypes from './appActionTypes';

export function setUserAuthenticated(bool) {
  return {
    type: actionTypes.SET_USER_AUTHENTICATED,
    bool,
  };
}

export function setUserAuthorized(bool) {
  return {
    type: actionTypes.SET_USER_AUTHORIZED,
    bool,
  };
}

export function setBallotsAndVotes(arr) {
  return {
    type: actionTypes.SET_BALLOTS_AND_VOTES,
    arr,
  };
}

export function setFirebaseAccessToken(text) {
  return {
    type: actionTypes.SET_FIREBASE_ACCESS_TOKEN,
    text,
  };
}

export function setLoading(bool) {
  return {
    type: actionTypes.SET_LOADING,
    bool,
  };
}

export function setRouteToRegisterForm(bool) {
  return {
    type: actionTypes.SET_ROUTE_TO_REGISTER_FORM,
    bool,
  };
}

export function setUserWantsEmailSignup(text) {
  return {
    type: actionTypes.SET_USER_WANTS_EMAIL_SIGNUP,
    text,
  };
}

export function setFacebookData(obj) {
  return {
    type: actionTypes.SET_FACEBOOK_DATA,
    obj,
  };
}

export function setUserTransactionHistory(arr) {
  return {
    type: actionTypes.SET_USER_TRANSACTION_HISTORY,
    arr,
  };
}

export function setAvailableDeliveriesLeft(num) {
  return {
    type: actionTypes.SET_AVAILABLE_DELIVERIES_LEFT,
    num,
  };
}

export function setDeliveryEligibilityObj(obj) {
  return {
    type: actionTypes.SET_DELIVERY_ELIGIBILITY_OBJ,
    obj,
  };
}

export function logOut() {
  return {
    type: actionTypes.LOGOUT,
  };
}
