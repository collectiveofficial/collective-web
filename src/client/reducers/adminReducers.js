import moment from 'moment';
import actionTypes from '../action-creators/admin/adminActionTypes.js';

const initialState = {
  dashboardPageSelected: 'home',
  adminAuthorized: 'false',
  adminData: [],
  stepIndex: 0,
  // Add time
  intendedPickupTimeStart: moment(),
  intendedPickupTimeEnd: moment(),
  voteDateTimeBeg: moment(),
  voteDateTimeEnd: moment(),
  // Add location
  locationStreetNumber: '',
  locationStreetName: '',
  locationCity: '',
  locationState: '',
  locationZipCode: '',
  formattedAddress: '',
  markerAddress: '',
  // Add food items
  foodItems: [],
  selectedFoodItems: [],
  bulkBuySaved: false,
  newItem: '',
  newImageUrl: '',
  isValidAddress: false,
};

const adminReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_DASHBOARD_PAGE:
      return { ...state, dashboardPageSelected: action.text };
    case actionTypes.AUTHORIZE_ADMIN:
      return { ...state, adminAuthorized: action.bool };
    case actionTypes.SET_ADMIN_DATA:
      return { ...state, adminData: action.dataArr };
    case actionTypes.SET_PICKUP_TIME_START:
      return { ...state, intendedPickupTimeStart: action.dateTime };
    case actionTypes.SET_PICKUP_TIME_END:
      return { ...state, intendedPickupTimeEnd: action.dateTime };
    case actionTypes.SET_VOTE_TIME_BEG:
      return { ...state, voteDateTimeBeg: action.dateTime };
    case actionTypes.SET_VOTE_TIME_END:
      return { ...state, voteDateTimeEnd: action.dateTime };
    case actionTypes.SET_LOCATION_STREET_NUMBER:
      return { ...state, locationStreetNumber: action.text };
    case actionTypes.SET_LOCATION_STREET_NAME:
      return { ...state, locationStreetName: action.text };
    case actionTypes.SET_LOCATION_CITY:
      return { ...state, locationCity: action.text };
    case actionTypes.SET_LOCATION_STATE:
      return { ...state, locationState: action.text };
    case actionTypes.SET_LOCATION_ZIP_CODE:
      return { ...state, locationZipCode: action.text };
    case actionTypes.SET_FORMATTED_ADDRESS:
      return { ...state, formattedAddress: action.text };
    case actionTypes.SET_MARKER_ADDRESS:
      return { ...state, markerAddress: action.text };
    case actionTypes.SET_PREV_STEP:
      return { ...state, stepIndex: action.index };
    case actionTypes.SET_NEXT_STEP:
      return { ...state, stepIndex: action.index };
    case actionTypes.SUBMIT_NEW_BULK_BUY:
      return { ...state, bulkBuySaved: action.bulkBuySaved };
    case actionTypes.SET_ADMIN_FOOD_ITEMS:
      return { ...state, foodItems: action.dataArr };
    case actionTypes.SET_SELECTED_FOOD_ITEMS:
      return { ...state, selectedFoodItems: action.dataArr };
    case actionTypes.SET_NEW_ITEM:
      return { ...state, newItem: action.text };
    case actionTypes.SET_NEW_IMAGE_URL:
      return { ...state, newImageUrl: action.text };
    default:
      return state;
  }
};

export default adminReducers;
