var initialModalIsOpenState = false; // TODO GET MORE SPECIFIC GODAMMIT
var initialPriceState = 0;
var initialPaymentErrorMessageState = '';
var initialDormState = 0; // TODO GET MORE SPECIFIC GODAMMIT
var initialCookState = 0; // TODO GET MORE SPECIFIC GODAMMIT
var initialHasPaymentCompletedState = false;
var initialVotesSavedState = false;


export function _modalIsOpenState(state=initialModalIsOpenState, action) {
  switch (action.type) {
    case 'SET_MODAL_IS_OPEN':
      console.log('_modalIsOpenState state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _price(state=initialPriceState, action) {
  switch (action.type) {
    case 'SET_PRICE':
      console.log('_price state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _paymentErrorMessage(state=initialPaymentErrorMessageState, action) {
  switch (action.type) {
    case 'SET_PAYMENT_ERROR_MESSAGE':
      console.log('_paymentErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _dorm(state=initialDormState, action) {
  switch (action.type) {
    case 'SET_DORM':
      console.log('_dorm state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _cook(state=initialCookState, action) {
  switch (action.type) {
    case 'SET_COOK':
      console.log('_cook state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _hasPaymentCompleted(state=initialHasPaymentCompletedState, action) {
  switch (action.type) {
    case 'SET_HAS_PAYMENT_COMPLETED':
      console.log('_hasPaymentCompleted state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _votesSaved(state=initialVotesSavedState, action) {
  switch (action.type) {
    case 'SET_VOTES_SAVED':
      console.log('_votesSaved state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}
