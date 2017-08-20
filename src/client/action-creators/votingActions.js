export const SET_VOTES = 'SET_VOTES';
export const SET_PRICE = 'SET_PRICE';
export const SET_VOTE_ERROR_MSG = 'SET_VOTE_ERROR_MSG';
export const SET_ALLOW_CONTINUE_TO_PAYMENT = 'SET_ALLOW_CONTINUE_TO_PAYMENT';
export const SET_HAS_USER_PAID = 'SET_HAS_USER_PAID';
export const SET_VOTES_HAVE_FINISHED_UPDATING = 'SET_VOTES_HAVE_FINISHED_UPDATING';

export function setVotes(num) {
  return { type: SET_VOTES, num }
}

export function setPrice(num) {
  return { type: SET_PRICE, num }
}

export function setVoteErrorMessage(text) {
  return { type: SET_VOTE_ERROR_MSG, text }
}

export function setAllowContinueToPayment(text) {
  return { type: SET_ALLOW_CONTINUE_TO_PAYMENT, text }
}

export function setHasUserPaid(bool) {
  return { type: SET_HAS_USER_PAID, bool }
}

export function setVotesHaveFinishedUpdating(text) {
  return { type: SET_VOTES_HAVE_FINISHED_UPDATING, text }
}
