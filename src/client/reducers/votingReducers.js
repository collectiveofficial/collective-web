var initialVotesState = 6;
var initialPriceState = 0;
var initialVoteErrorMessageState = '';
var initialAllowContinueToPaymentState = '';
var initialHasUserPaidState = false;
var initialVotesHaveFinishedUpdatingState = '';


export function _votes(state=initialVotesState, action) {
  switch (action.type) {
    case 'SET_VOTES':
      console.log('_votes state called with state: ', state, 'and action: ', action);
      return action.num;

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

export function _voteErrorMessage(state=initialVoteErrorMessageState, action) {
  switch (action.type) {
    case 'SET_VOTE_ERROR_MSG':
      console.log('_voteErrorMessage state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _allowContinueToPayment(state=initialAllowContinueToPaymentState, action) {
  switch (action.type) {
    case 'SET_ALLOW_CONTINUE_TO_PAYMENT':
      console.log('_allowContinueToPayment state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _hasUserPaid(state=initialHasUserPaidState, action) {
  switch (action.type) {
    case 'SET_HAS_USER_PAID':
      console.log('_hasUserPaid state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _votesHaveFinishedUpdating(state=initialVotesHaveFinishedUpdatingState, action) {
  switch (action.type) {
    case 'SET_VOTES_HAVE_FINISHED_UPDATING':
      console.log('_votesHaveFinishedUpdating state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}
