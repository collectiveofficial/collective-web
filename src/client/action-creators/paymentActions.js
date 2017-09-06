export const SET_MODAL_IS_OPEN = 'SET_MODAL_IS_OPEN'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_PRICE = 'SET_PRICE';
export const SET_PAYMENT_ERROR_MESSAGE = 'SET_PAYMENT_ERROR_MESSAGE';
export const SET_DORM = 'SET_DORM'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_COOK = 'SET_COOK'; // TODO GET MORE SPECIFIC GODAMMIT
export const SET_HAS_PAYMENT_COMPLETED = 'SET_HAS_PAYMENT_COMPLETED';
export const SET_VOTES_SAVED = 'SET_VOTES_SAVED';
export const ENTER_PAYMENT_PAGE = 'ENTER_PAYMENT_PAGE';
export const SET_HAS_ALLERGIES = 'SET_HAS_ALLERGIES';
export const SET_PAYMENT_EMAIL = 'SET_PAYMENT_EMAIL';
export const SET_USER_WANTS_DELIVERY = 'SET_USER_WANTS_DELIVERY';
export const SET_SERVER_PAYMENT_ERROR_MSG = 'SET_SERVER_PAYMENT_ERROR_MSG';
export const SET_DELIVERY_PRICE_IMPACT = 'SET_DELIVERY_PRICE_IMPACT';
export const SET_ALLERGIES_LIST = 'SET_ALLERGIES_LIST';

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

export function enterPaymentPage(bool) {
  return { type: ENTER_PAYMENT_PAGE, bool }
}

export function setHasAllegies(bool) {
  return { type: SET_HAS_ALLERGIES, bool }
}

export function setPaymentEmail(text) {
  return { type: SET_PAYMENT_EMAIL, text }
}

export function setUserWantsDelivery(bool) {
  return { type: SET_USER_WANTS_DELIVERY, bool }
}

export function setServerPaymentErrorMessage(text) {
  return { type: SET_SERVER_PAYMENT_ERROR_MSG, text }
}

export function setDeliveryPriceImpact(num) {
  return { type: SET_DELIVERY_PRICE_IMPACT, num }
}

export function setAllergiesList(arr) {
  return { type: SET_ALLERGIES_LIST, arr }
}
