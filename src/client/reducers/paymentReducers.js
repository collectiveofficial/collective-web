var initialModalIsOpenState = false; // TODO GET MORE SPECIFIC GODAMMIT
var initialPriceState = 0;
var initialPaymentErrorMessageState = '';
var initialDormState = 0; // TODO GET MORE SPECIFIC GODAMMIT
var initialCookState = 0; // TODO GET MORE SPECIFIC GODAMMIT
var initialHasPaymentCompletedState = false;
var initialVotesSavedState = false;

var intialHasAllergiesState = false;
var intialPaymentEmailState = '';
var intialUserWantsDeliveryState = false;
var intialServerPaymentErrorMessageState = '';
var intialDeliveryPriceImpactState = 0;
var intialAllergiesListState = [];


export function _modalIsOpenState(state=initialModalIsOpenState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialModalIsOpenState;
    }
  switch (action.type) {
    case 'SET_MODAL_IS_OPEN':
      console.log('_modalIsOpenState state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _price(state=initialPriceState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialPriceState;
    }
  switch (action.type) {
    case 'SET_PRICE':
      console.log('_price state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _paymentErrorMessage(state=initialPaymentErrorMessageState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialPaymentErrorMessageState;
    }
  switch (action.type) {
    case 'SET_PAYMENT_ERROR_MESSAGE':
      console.log('_paymentErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _dorm(state=initialDormState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialDormState;
    }
  switch (action.type) {
    case 'SET_DORM':
      console.log('_dorm state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _cook(state=initialCookState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialCookState;
    }
  switch (action.type) {
    case 'SET_COOK':
      console.log('_cook state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _hasPaymentCompleted(state=initialHasPaymentCompletedState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialHasPaymentCompletedState;
    }
  switch (action.type) {
    case 'SET_HAS_PAYMENT_COMPLETED':
      console.log('_hasPaymentCompleted state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _votesSaved(state=initialVotesSavedState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return initialVotesSavedState;
    }
  switch (action.type) {
    case 'SET_VOTES_SAVED':
      console.log('_votesSaved state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _hasAllergies(state=intialHasAllergiesState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialHasAllergiesState;
    }
  switch (action.type) {
    case 'SET_HAS_ALLERGIES':
      console.log('_hasAllergies state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _paymentEmail(state=intialPaymentEmailState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialPaymentEmailState;
    }
  switch (action.type) {
    case 'SET_PAYMENT_EMAIL':
      console.log('_paymentEmail state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _userWantsDelivery(state=intialUserWantsDeliveryState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialUserWantsDeliveryState;
    }
  switch (action.type) {
    case 'SET_USER_WANTS_DELIVERY':
      console.log('_userWantsDelivery state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _serverPaymentErrorMessage(state=intialServerPaymentErrorMessageState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialServerPaymentErrorMessageState;
    }
  switch (action.type) {
    case 'SET_SERVER_PAYMENT_ERROR_MSG':
      console.log('_serverPaymentErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _deliveryPriceImpact(state=intialDeliveryPriceImpactState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialDeliveryPriceImpactState;
    }
  switch (action.type) {
    case 'SET_DELIVERY_PRICE_IMPACT':
      console.log('_deliveryPriceImpact state called with state: ', state, 'and action: ', action);
      return action.num;

    default:
      return state
  }
}

export function _allergiesList(state=intialAllergiesListState, action) {
  if (['LOGOUT','ENTER_PAYMENT_PAGE'].includes(action.type)) {
      return intialAllergiesListState;
    }
  switch (action.type) {
    case 'SET_ALLERGIES_LIST':
      console.log('_allergiesList state called with state: ', state, 'and action: ', action);
      return [...action.arr];

    default:
      return state
  }
}
