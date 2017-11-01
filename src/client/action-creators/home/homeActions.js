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

export function handlePrev(index) {
  if (index > 0) {
    return {
      type: actionTypes.SET_PREV_STEP,
      index: index - 1,
    };
  }
}

export function handleNext(index, stepProps) {
  if (index < stepProps.length - 1) {
    return {
      type: actionTypes.SET_NEXT_STEP,
      index: index + 1,
    };
  }
}
