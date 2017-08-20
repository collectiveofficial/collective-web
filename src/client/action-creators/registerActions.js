export const SET_FIRST_NAME = 'SET_FIRST_NAME';
export const SET_LAST_NAME = 'SET_LAST_NAME';
// export const SET_EMAIL_INPUT = 'SET_EMAIL_INPUT'; // Already in loginActions.js
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_BIRTHDAY = 'SET_BIRTHDAY';
export const SET_STREET_ADDRESS = 'SET_STREET_ADDRESS';
export const SET_APT_SUITE = 'SET_APT_SUITE';
export const SET_CITY = 'SET_CITY';
export const SET_STATE = 'SET_STATE';
export const SET_ZIPCODE = 'SET_ZIPCODE';
export const SET_IS_FIRST_NAME_EMPTY = 'SET_IS_FIRST_NAME_EMPTY';
export const SET_IS_LAST_NAME_EMPTY = 'SET_IS_LAST_NAME_EMPTY';
export const SET_IS_PHONE_NUMBER_EMPTY = 'SET_IS_PHONE_NUMBER_EMPTY';
export const SET_IS_BIRTHDAY_EMPTY = 'SET_IS_BIRTHDAY_EMPTY';
export const SET_IS_STREET_ADDRESS_EMPTY = 'SET_IS_STREET_ADDRESS_EMPTY';
export const SET_IS_CITY_EMPTY = 'SET_IS_CITY_EMPTY';
export const SET_IS_STATE_EMPTY = 'SET_IS_STATE_EMPTY';
export const SET_IS_ZIPCODE_EMPTY = 'SET_IS_ZIPCODE_EMPTY';
export const SET_ARE_THERE_EMPTY_FIELDS = 'SET_ARE_THERE_EMPTY_FIELDS';
export const SET_IS_INVALID_STATE = 'SET_IS_INVALID_STATE';
export const SET_VALUE = 'SET_VALUE';

export function setFirstName(text) {
  return { type: SET_FIRST_NAME, text }
}

export function setLastName(text) {
  return { type: SET_LAST_NAME, text }
}

export function setPhoneNumber(text) {
  return { type: SET_PHONE_NUMBER, text }
}

export function setBirthday(text) {
  return { type: SET_BIRTHDAY, text }
}

export function setStreetAddress(text) {
  return { type: SET_STREET_ADDRESS, text }
}

export function setAptSuite(text) {
  return { type: SET_APT_SUITE, text }
}

export function setCity(text) {
  return { type: SET_CITY, text }
}

export function setState(text) {
  return { type: SET_STATE, text }
}

export function setZipcode(text) {
  return { type: SET_ZIPCODE, text }
}

export function setIsFirstNameEmpty(bool) {
  return { type: SET_IS_FIRST_NAME_EMPTY, bool }
}

export function setIsLastNameEmpty(bool) {
  return { type: SET_IS_LAST_NAME_EMPTY, bool }
}

export function setIsPhoneNumberEmpty(bool) {
  return { type: SET_IS_PHONE_NUMBER_EMPTY, bool }
}

export function setIsBirthdayEmpty(bool) {
  return { type: SET_IS_BIRTHDAY_EMPTY, bool }
}

export function setIsStreetAddressEmpty(bool) {
  return { type: SET_IS_STREET_ADDRESS_EMPTY, bool }
}

export function setIsCityEmpty(bool) {
  return { type: SET_IS_CITY_EMPTY, bool }
}

export function setIsStateEmpty(bool) {
  return { type: SET_IS_STATE_EMPTY, bool }
}

export function setIsZipcodeEmpty(bool) {
  return { type: SET_IS_ZIPCODE_EMPTY, bool }
}

export function setAreThereEmptyFields(text) {
  return { type: SET_ARE_THERE_EMPTY_FIELDS, text }
}

export function setIsInvalidState(bool) {
  return { type: SET_IS_INVALID_STATE, bool }
}

export function setValue(text) {
  return { type: SET_VALUE, text } // TODO RENAME
}
