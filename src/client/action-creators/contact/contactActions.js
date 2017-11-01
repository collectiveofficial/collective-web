import actionTypes from './contactActionTypes';

export function setProvider(text) {
  return { type: actionTypes.SET_PROVIDER, text };
}
