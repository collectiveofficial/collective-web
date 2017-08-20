export const SET_MODAL_IS_OPEN = 'SET_MODAL_IS_OPEN'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_PRICE = 'SET_PRICE';
export const SET_PAYMENT_ERROR_MESSAGE = 'SET_PAYMENT_ERROR_MESSAGE';
export const SET_DORM = 'SET_DORM'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_COOK = 'SET_COOK'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_HAS_PAYMENT_COMPLETED = 'SET_HAS_PAYMENT_COMPLETED';
export const SET_VOTES_SAVED = 'SET_VOTES_SAVED';

export function setModalIsOpen(bool) {
  return { type: SET_MODAL_IS_OPEN, bool }
}

export function setPrice(num) {
  return { type: SET_PRICE, num }
}

export function setPaymentErrorMessage(text) {
  return { type: SET_PAYMENT_ERROR_MESSAGE, text }
}

export function setDorm(num) {
  return { type: SET_DORM, num } // TODO GET MORE SPECIFIC GODAMMIT
}

export function setCook(num) {
  return { type: SET_COOK, num } // TODO GET MORE SPECIFIC GODAMMIT
}

export function setHasPaymentCompleted(bool) {
  return { type: SET_HAS_PAYMENT_COMPLETED, bool }
}

export function setVotesSaved(bool) {
  return { type: SET_VOTES_SAVED, bool }
}
