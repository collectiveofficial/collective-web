var initialFirstNameState = '';
var initialLastNameState = '';
var initialPhoneNumberState = '';
var initialBirthdayState = '';
var initialStreetAddressState = '';
var initialAptSuiteState = '';
var initialCityState = '';
var initialStateState = '';
var initialZipCodeState = '';
var initialIsFirstNameEmptyState = false;
var initialIsLastNameEmptyState = false;
var initialIsPhoneNumberEmptyState = false;
var initialIsBirthdayEmptyState = false;
var initialIsStreetAddressEmptyState = false;
var initialIsCityEmptyState = false;
var initialIsStateEmptyState = false;
var initialIsZipCodeEmptyState = false;
var initialAreThereEmptyFieldsState = '';
var initialIsInvalidStateState = false;
var initialIsInvalidSchoolState = false;
var initialIsFakeAddressState = false;
var initialSchoolState = '';
var initialIsSchoolEmptyState = false;

export function _firstName(state=initialFirstNameState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialFirstNameState;
    }
  switch (action.type) {

    case 'SET_FIRST_NAME':
      return action.text;

    default:
      return state
  }
}

export function _lastName(state=initialLastNameState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialLastNameState;
    }
  switch (action.type) {

    case 'SET_LAST_NAME':
      return action.text;

    default:
      return state
  }
}

export function _phoneNumber(state=initialPhoneNumberState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialPhoneNumberState;
    }
  switch (action.type) {

    case 'SET_PHONE_NUMBER':
      return action.text;

    default:
      return state
  }
}

export function _birthday(state=initialBirthdayState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialBirthdayState;
    }
  switch (action.type) {

    case 'SET_BIRTHDAY':
      return action.text;

    default:
      return state
  }
}

export function _streetAddress(state=initialStreetAddressState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialStreetAddressState;
    }
  switch (action.type) {

    case 'SET_STREET_ADDRESS':
      return action.text;

    default:
      return state
  }
}

export function _aptSuite(state=initialAptSuiteState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialAptSuiteState;
    }
  switch (action.type) {

    case 'SET_APT_SUITE':
      return action.text;

    default:
      return state
  }
}

export function _city(state=initialCityState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialCityState;
    }
  switch (action.type) {

    case 'SET_CITY':
      return action.text;

    default:
      return state
  }
}

export function _state(state=initialStateState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialStateState;
    }
  switch (action.type) {

    case 'SET_STATE':
      return action.text;

    default:
      return state
  }
}

export function _zipCode(state=initialZipCodeState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialZipCodeState;
    }
  switch (action.type) {

    case 'SET_ZIP_CODE':
      return action.text;

    default:
      return state
  }
}

export function _isFirstNameEmpty(state=initialIsFirstNameEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsFirstNameEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_FIRST_NAME_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isLastNameEmpty(state=initialIsLastNameEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsLastNameEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_LAST_NAME_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isPhoneNumberEmpty(state=initialIsPhoneNumberEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsPhoneNumberEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_PHONE_NUMBER_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isBirthdayEmpty(state=initialIsBirthdayEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsBirthdayEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_BIRTHDAY_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isStreetAddressEmpty(state=initialIsStreetAddressEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsStreetAddressEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_STREET_ADDRESS_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isCityEmpty(state=initialIsCityEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsCityEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_CITY_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isStateEmpty(state=initialIsStateEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsStateEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_STATE_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _isZipCodeEmpty(state=initialIsZipCodeEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsZipCodeEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_ZIP_CODE_EMPTY':
      return action.bool;

    default:
      return state
  }
}

export function _areThereEmptyFields(state=initialAreThereEmptyFieldsState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialAreThereEmptyFieldsState;
    }
  switch (action.type) {

    case 'SET_ARE_THERE_EMPTY_FIELDS':
      return action.text;

    default:
      return state
  }
}

export function _isInvalidState(state=initialIsInvalidStateState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsInvalidStateState;
    }
  switch (action.type) {

    case 'SET_IS_INVALID_STATE':
      return action.bool;

    default:
      return state
  }
}

export function _isInvalidSchool(state=initialIsInvalidSchoolState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsInvalidSchoolState;
    }
  switch (action.type) {

    case 'SET_IS_INVALID_SCHOOL':
      return action.bool;

    default:
      return state
  }
}

export function _isFakeAddress(state=initialIsFakeAddressState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsFakeAddressState;
    }
  switch (action.type) {

    case 'SET_IS_FAKE_ADDRESS':
      return action.bool;

    default:
      return state
  }
}

export function _school(state=initialSchoolState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialSchoolState;
    }
  switch (action.type) {

    case 'SET_SCHOOL':
      return action.text;

    default:
      return state
  }
}

export function _isSchoolEmpty(state=initialIsSchoolEmptyState, action) {
  if (['LOGOUT','ENTER_REGISTRATION_PAGE'].includes(action.type)) {
      return initialIsSchoolEmptyState;
    }
  switch (action.type) {

    case 'SET_IS_SCHOOL_EMPTY':
      return action.bool;

    default:
      return state
  }
}
