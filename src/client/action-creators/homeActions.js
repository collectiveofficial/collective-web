export const SET_DATE = 'SET_DATE';
export const SET_VOTE = 'SET_VOTE';
export const SET_REMAINING_CALENDAR = 'SET_REMAINING_CALENDAR';
export const SET_ITEMS = 'SET_ITEMS';
export const SET_PROVIDER = 'SET_PROVIDER';
export const SET_LOCATION = 'SET_LOCATION';


export function setDate(text) {
  return { type: SET_DATE, text }
}

export function setVote(text) {
  return { type: SET_VOTE, text }
}

export function setRemainingCalendar(arr) {
  return { type: SET_REMAINING_CALENDAR, arr }
}

export function setItems(text) {
  return { type: SET_ITEMS, text }
}

export function setProvider(text) {
  return { type: SET_PROVIDER, text }
}


export function setLocation(text) {
  return { type: SET_LOCATION, text }
}
