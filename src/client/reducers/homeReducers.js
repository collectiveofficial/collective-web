import actionTypes from '../action-creators/home/homeActionTypes.js';

const initialState = {
  currentFutureDropoffs: [],
  showHomeMap: false,
  provider: 'DNO Produce',
  stepIndex: 0,
};

const homeReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGOUT:
      return initialState;
    case actionTypes.SET_PROVIDER:
      return {
        ...state,
        provider: action.text,
      };
    case actionTypes.SET_CURRENT_FUTURE_DROPOFFS:
      return {
        ...state,
        currentFutureDropoffs: action.arr,
      };
    case actionTypes.SET_PREV_STEP:
      return { ...state, stepIndex: action.index };
    case actionTypes.SET_NEXT_STEP:
      return { ...state, stepIndex: action.index };
    case actionTypes.TOGGLE_HOME_MAP:
      if (action.bool === undefined) {
        action.bool = !state.showHomeMap;
      }
      return {
        ...state,
        showHomeMap: action.bool,
      };

    default:
      return state;
  }
};

export default homeReducers;
