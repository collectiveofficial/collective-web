import actionTypes from './adminActionTypes';

export function selectDashboardPage(text) {
  return {
    type: actionTypes.SELECT_DASHBOARD_PAGE,
    text,
  };
}
