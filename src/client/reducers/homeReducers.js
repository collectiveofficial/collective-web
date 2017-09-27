const initialDateState = '8 October 2017 from 12:00 PM to 4:00 PM';
const initialVoteState = 'Voting window is from 20 September at 12:00 AM to 5 October at 11:59 PM';
const initialRemainingCalendarState = [
  ['17 October 2017',  "Voting window is from 6 October at 12:00 AM to 14 October at 11:59 PM"],
  ['28 October 2017',  "Voting window is from 15 October at 12:00 AM to 25 October at 11:59 PM"],
  ['10 November 2017', "Voting window is from 26 October at 12:00 AM to 8 November at 11:59 PM"],
  ['2 December 2017',  "Voting window is from 9 November at 12:00 AM to 29 November at 11:59 PM"]
];
const initialItemsState = ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'];
const initialProviderState = 'DNO Produce';
//label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
const initialLocationState = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university';

export function _date(state=initialDateState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialDateState;
    }
  switch (action.type) {
    case 'SET_DATE':
      return action.text;

    default:
      return state
  }
}

export function _vote(state=initialVoteState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialVoteState;
    }
  switch (action.type) {
    case 'SET_VOTE':
      return action.text;

    default:
      return state
  }
}

export function _remainingCalendar(state=initialRemainingCalendarState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialRemainingCalendarState;
    }
  switch (action.type) {
    case 'SET_REMAINING_CALENDAR':
      return [/*...state,*/ ...action.arr]; // We probably don't want to keep last state yet

    default:
      return state
  }
}

export function _items(state=initialItemsState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialItemsState;
    }
  switch (action.type) {
    case 'SET_ITEMS':
      return action.text;

    default:
      return state
  }
}

export function _provider(state=initialProviderState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialProviderState;
    }
  switch (action.type) {
    case 'SET_PROVIDER':
      return action.text;

    default:
      return state
  }
}

export function _location(state=initialLocationState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialLocationState;
    }
  switch (action.type) {
    case 'SET_LOCATION':
      return action.text;

    default:
      return state
  }
}
