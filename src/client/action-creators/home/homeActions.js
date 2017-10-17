import actionTypes from './homeActionTypes';

export function setDate(text) {
  return { type: actionTypes.SET_DATE, text }
}

export function setVote(text) {
  return { type: actionTypes.SET_VOTE, text }
}

export function setRemainingCalendar(arr) {
  return { type: actionTypes.SET_REMAINING_CALENDAR, arr }
}

export function setProvider(text) {
  return { type: actionTypes.SET_PROVIDER, text }
}

export function setLocation(text) {
  return { type: actionTypes.SET_LOCATION, text }
}
