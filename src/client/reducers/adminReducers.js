import actionTypes from '../action-creators/admin/adminActionTypes.js';

const initialState = {
  dashboardPageSelected: 'home',
  adminAuthorized: 'false',
  adminData: [],
  summaryURL: '',
  foodBallotsURL: '',
  participantDataURL: '',
};

const adminReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_DASHBOARD_PAGE:
      return { ...state, dashboardPageSelected: action.text };
    case actionTypes.AUTHORIZE_ADMIN:
      return { ...state, adminAuthorized: action.bool };
    case actionTypes.SET_ADMIN_DATA:
      return { ...state, adminData: action.dataArr };
    case actionTypes.DOWNLOAD_SUMMARY:
      return { ...state, summaryURL: action.summaryURL };
    case actionTypes.DOWNLOAD_FOOD_BALLOTS:
      return { ...state, foodBallotsURL: action.foodBallotsURL };
    case actionTypes.DOWNLOAD_PARTICIPANT_DATA:
      return { ...state, participantDataURL: action.participantDataURL };
    default:
      return state;
  }
};

export default adminReducers;
