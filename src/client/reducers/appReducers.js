var initialUserAuthenticatedState = false;
var initialUserAuthorizedState = false;
var initialBallotsAndVotesState = []; // Move?
var initialLoadingState = true;
var initialFirebaseAccessTokenState = '';
var initialRouteToRegisterFormState = false;
var initialUserWantsEmailSignupState = '';
var initialFacebookDataState = [];
var initialTransactionHistoryState = [];
var initialAvailableDeliveriesLeftState = ''; // Need to do error handling
var initialDeliveryEligibilityObjState = {};

export function _userAuthenticated(state=initialUserAuthenticatedState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialUserAuthenticatedState;
    }
  switch (action.type) {
    case 'SET_USER_AUTHENTICATED':
      return action.bool;

    default:
      return state
  }
}

export function _userAuthorized(state=initialUserAuthorizedState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialUserAuthorizedState;
    }
  switch (action.type) {
    case 'SET_USER_AUTHORIZED':
      return action.bool;

    default:
      return state
  }
}

export function _ballotsAndVotes(state=initialBallotsAndVotesState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialBallotsAndVotesState;
    }
  switch (action.type) {
    case 'SET_BALLOTS_AND_VOTES':
      return [...action.arr];

    default:
      return state
  }
}

export function _firebaseAccessToken(state=initialFirebaseAccessTokenState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialFirebaseAccessTokenState;
    }
  switch (action.type) {
    case 'SET_FIREBASE_ACCESS_TOKEN':
      return action.text;

    default:
      return state
  }
}

export function _loading(state=initialLoadingState, action) {
  if ([].includes(action.type)) {
      return initialLoadingState;
    }
  switch (action.type) {
    case 'SET_LOADING':
      return action.bool;

    default:
      return state
  }
}

export function _routeToRegisterForm(state=initialRouteToRegisterFormState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialRouteToRegisterFormState;
    }
  switch (action.type) {
    case 'SET_ROUTE_TO_REGISTER_FORM':
      return action.bool;

    default:
      return state
  }
}

export function _userWantsEmailSignup(state=initialUserWantsEmailSignupState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialUserWantsEmailSignupState;
    }
  switch (action.type) {
    case 'SET_USER_WANTS_EMAIL_SIGNUP':
      return action.text;

    default:
      return state
  }
}

export function _facebookData(state=initialFacebookDataState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialFacebookDataState;
    }
  switch (action.type) {
    case 'SET_FACEBOOK_DATA':
      return {...action.obj};

    default:
      return state
  }
}

export function _transactionHistory(state=initialTransactionHistoryState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialTransactionHistoryState;
    }
  switch (action.type) {
    case 'SET_USER_TRANSACTION_HISTORY':
      return [...action.arr];

    default:
      return state
  }
}

export function _availableDeliveriesLeft(state=initialAvailableDeliveriesLeftState, action) {
  if ([].includes(action.type)) {
      return initialAvailableDeliveriesLeftState;
    }
  switch (action.type) {
    case 'SET_AVAILABLE_DELIVERIES_LEFT':
      return action.num;

    default:
      return state
  }
}

export function _deliveryEligibilityObj(state=initialDeliveryEligibilityObjState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialDeliveryEligibilityObjState;
    }
  switch (action.type) {
    case 'SET_DELIVERY_ELIGIBILITY_OBJ':
      return {...action.obj};

    default:
      return state
  }
}
