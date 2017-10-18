import actionTypes from './homeActionTypes';

export function setProvider(text) {
  return { type: actionTypes.SET_PROVIDER, text };
}

export function setCurrentFutureDropoffs(arr) {
  return { type: actionTypes.SET_CURRENT_FUTURE_DROPOFFS, arr };
}

export function toggleHomeMap(bool) {
  return { type: actionTypes.TOGGLE_HOME_MAP, bool };
}
