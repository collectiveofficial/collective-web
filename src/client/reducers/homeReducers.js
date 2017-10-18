import actionTypes from '../action-creators/home/homeActionTypes.js';

const initialState = {
  currentFutureDropoffs: [],
  showHomeMap: false,
  provider: 'DNO Produce',
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
    case 'SET_CURRENT_FUTURE_DROPOFFS':
      return {
        ...state,
        currentFutureDropoffs: action.arr,
      };
    case 'TOGGLE_HOME_MAP':
      if (action.bool === undefined) {
        action.bool = !state.showHomeMap;
      }
      return {
        ...state,
        showHomeMap: action.bool,
      };

    default:
      return state
  }
}

export default homeReducers;
