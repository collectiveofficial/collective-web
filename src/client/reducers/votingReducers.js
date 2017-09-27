var initialVotesState = 6;
var initialPriceState = 0;
var initialVoteErrorMessageState = '';
var initialAllowContinueToPaymentState = '';
var initialHasUserPaidState = false;
var initialVotesHaveFinishedUpdatingState = '';


export function _votes(state=initialVotesState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialVotesState;
    }
  switch (action.type) {

    case 'SET_VOTES':
      return action.num;

    default:
      return state
  }
}

export function _price(state=initialPriceState, action) {
  if (['LOGOUT', 'ENTER_VOTES_PAGE'].includes(action.type)) {
      return initialPriceState;
    }
  switch (action.type) {

    case 'SET_PRICE':
      return action.num;

    default:
      return state
  }
}

export function _voteErrorMessage(state=initialVoteErrorMessageState, action) {
  if (['LOGOUT', 'ENTER_VOTES_PAGE'].includes(action.type)) {
      return initialVoteErrorMessageState;
    }
  switch (action.type) {

    case 'SET_VOTE_ERROR_MSG':
      return action.text;

    default:
      return state
  }
}

export function _allowContinueToPayment(state=initialAllowContinueToPaymentState, action) {
  if (['LOGOUT', 'ENTER_VOTES_PAGE'].includes(action.type)) {
      return initialAllowContinueToPaymentState;
    }
  switch (action.type) {

    case 'SET_ALLOW_CONTINUE_TO_PAYMENT':
      return action.text;

    default:
      return state
  }
}

export function _hasUserPaid(state=initialHasUserPaidState, action) {
  if (['LOGOUT'].includes(action.type)) {
      return initialHasUserPaidState;
    }
  switch (action.type) {

    case 'SET_HAS_USER_PAID':
      return action.bool;

    default:
      return state
  }
}

export function _votesHaveFinishedUpdating(state=initialVotesHaveFinishedUpdatingState, action) {
  if (['LOGOUT', 'ENTER_VOTES_PAGE'].includes(action.type)) {
      return initialVotesHaveFinishedUpdatingState;
    }
  switch (action.type) {

    case 'SET_VOTES_HAVE_FINISHED_UPDATING':
      return action.text;

    default:
      return state
  }
}
