import actionTypes from '../action-creators/admin/adminActionTypes.js';

const initialState = {
  dashboardPageSelected: 'home',
};

const adminReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_DASHBOARD_PAGE:
      return { ...state, dashboardPageSelected: action.text };
    default:
      return state;
  }
};

export default adminReducers;
