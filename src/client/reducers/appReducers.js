var initialUserAuthenticatedState = false;
var initialUserAuthorizedState = false;
var initialBallotsAndVotesState = ''; // Move?
var initialLoadingState = true;
var initialFirebaseAccessTokenState = '';
var initialRouteToRegisterFormState = false;
var initialUserWantsEmailSignupState = '';
var initialFacebookDataState = [];

export function _userAuthenticated(state=initialUserAuthenticatedState, action) {
  switch (action.type) {
    case 'SET_USER_AUTHENTICATED':
      console.log('_userAuthenticated state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _userAuthorized(state=initialUserAuthorizedState, action) {
  switch (action.type) {
    case 'SET_USER_AUTHORIZED':
      console.log('_userAuthorized state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _ballotsAndVotes(state=initialBallotsAndVotesState, action) {
  switch (action.type) {
    case 'SET_BALLOTS_AND_VOTES':
      console.log('_ballotsAndVotes state called with state: ', state, 'and action: ', action);
      return [...action.arr];

    default:
      return state
  }
}

export function _firebaseAccessToken(state=initialFirebaseAccessTokenState, action) {
  switch (action.type) {
    case 'SET_FIREBASE_ACCESS_TOKEN':
      console.log('_firebaseAccessToken state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _loading(state=initialLoadingState, action) {
  switch (action.type) {
    case 'SET_LOADING':
      console.log('_loading state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _routeToRegisterForm(state=initialRouteToRegisterFormState, action) {
  switch (action.type) {
    case 'SET_ROUTE_TO_REGISTER_FORM':
      console.log('_routeToRegisterForm state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _userWantsEmailSignup(state=initialUserWantsEmailSignupState, action) {
  switch (action.type) {
    case 'SET_USER_WANTS_EMAIL_SIGNUP':
      console.log('_userWantsEmailSignup state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _facebookData(state=initialFacebookDataState, action) {
  switch (action.type) {
    case 'SET_FACEBOOK_DATA':
      console.log('_facebookData state called with state: ', state, 'and action: ', action);
      return {...action.obj};

    default:
      return state
  }
}
