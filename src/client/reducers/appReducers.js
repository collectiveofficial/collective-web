import actionTypes from '../action-creators/app/appActionTypes.js';

const initialState = {
  authenticated: false,
  userAuthorized: false,
  ballotsAndVotes: [],
  loading: true,
  firebaseAccessToken: '',
  routeToRegisterForm: false,
  userWantsEmailSignup: '',
  facebookData: [],
  transactionHistory: [],
  availableDeliveriesLeft: '',
  deliveryEligibilityObj: {},
};

const appReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT:
      return initialState;
    case actionTypes.SET_USER_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.bool,
      };
    case actionTypes.SET_USER_AUTHORIZED:
      return {
        ...state,
        userAuthorized: action.bool,
      };
    case actionTypes.SET_BALLOTS_AND_VOTES:
      return {
        ...state,
        ballotsAndVotes: action.arr,
      };
    case actionTypes.SET_FIREBASE_ACCESS_TOKEN:
      return {
        ...state,
        firebaseAccessToken: action.text,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.bool,
      };
    case actionTypes.SET_ROUTE_TO_REGISTER_FORM:
      return {
        ...state,
        routeToRegisterForm: action.bool,
      };
    case actionTypes.SET_USER_WANTS_EMAIL_SIGNUP:
      return {
        ...state,
        userWantsEmailSignup: action.text,
      };
    case actionTypes.SET_FACEBOOK_DATA:
      return {
        ...state,
        facebookData: action.obj,
      };
    case actionTypes.SET_USER_TRANSACTION_HISTORY:
      return {
        ...state,
        transactionHistory: action.arr,
      };
    case actionTypes.SET_AVAILABLE_DELIVERIES_LEFT:
      return {
        ...state,
        availableDeliveriesLeft: action.num,
      };
    case actionTypes.SET_DELIVERY_ELIGIBILITY_OBJ:
      return {
        ...state,
        deliveryEligibilityObj: action.obj,
      };
    default:
      return state;
  }
};

export default appReducers;
