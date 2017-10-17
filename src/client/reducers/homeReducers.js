import actionTypes from '../action-creators/home/homeActionTypes.js';

const initialState = {
  date: '27 October 2017 from 9:00 AM to 12:00 PM',
  vote: 'Voting window is from 16 October at 12:00 AM to 24 October at 11:59 PM',
  remainingCalendar: [
    ['9 November 2017', 'Voting window is from 25 October at 12:00 AM to 7 November at 11:59 PM'],
    ['2 December 2017', 'Voting window is from 8 November at 12:00 AM to 29 November at 11:59 PM']
  ],
  provider: 'DNO Produce',
  location: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university',
  // initialLocationState: 'https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ4dv6nYOOOIgRhBj1gY9yf8c&key=AIzaSyDcBcl_kMHNQwWHrQXAHZIb5Ig5I3mUkm0',

};

const homeReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
      return initialState;
    case 'SET_DATE':
      return {
        ...state,
        date: action.text,
      };
    case 'SET_VOTE':
      return {
        ...state,
        vote: action.text,
      };
    case 'SET_REMAINING_CALENDAR':
      return {
        ...state,
        remainingCalendar: action.arr,
      };
    case 'SET_PROVIDER':
      return {
        ...state,
        provider: action.text,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.text,
      };

    default:
      return state
  }
}

export default homeReducers;
