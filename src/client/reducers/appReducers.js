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
      console.log('_userAuthenticated state called with state: ', state, 'and action: ', action);
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
      console.log('_userAuthorized state called with state: ', state, 'and action: ', action);
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
      console.log('_ballotsAndVotes state called with state: ', state, 'and action: ', action);
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
      console.log('_firebaseAccessToken state called with state: ', state, 'and action: ', action);
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
      console.log('_loading state called with state: ', state, 'and action: ', action);
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
      console.log('_routeToRegisterForm state called with state: ', state, 'and action: ', action);
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
      console.log('_userWantsEmailSignup state called with state: ', state, 'and action: ', action);
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
      console.log('_facebookData state called with state: ', state, 'and action: ', action);
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
      console.log('_transactionHistory state called with state: ', state, 'and action: ', action);
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
      console.log('_availableDeliveriesLeft state called with state: ', state, 'and action: ', action);
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
      console.log('_deliveryEligibilityObj state called with state: ', state, 'and action: ', action);
      return {...action.obj};

    default:
      return state
  }
}
