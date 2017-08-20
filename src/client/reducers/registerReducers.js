var initialFirstNameState = '';
var initialLastNameState = '';
var initialPhoneNumberState = '';
var initialBirthdayState = '';
var initialStreetAddressState = '';
var initialAptSuiteState = '';
var initialCityState = '';
var initialStateState = '';
var initialZipcodeState = '';
var initialIsFirstNameEmptyState = false;
var initialIsLastNameEmptyState = false;
var initialIsPhoneNumberEmptyState = false;
var initialIsBirthdayEmptyState = false;
var initialIsStreetAddressEmptyState = false;
var initialIsCityEmptyState = false;
var initialIsStateEmptyState = false;
var initialIsZipcodeEmptyState = false;
var initialAreThereEmptyFieldsState = '';
var initialIsInvalidStateState = false;

export function _firstName(state=initialFirstNameState, action) {
  switch (action.type) {
    case 'SET_FIRST_NAME':
      console.log('_firstName state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _lastName(state=initialLastNameState, action) {
  switch (action.type) {
    case 'SET_LAST_NAME':
      console.log('_lastName state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _phoneNumber(state=initialPhoneNumberState, action) {
  switch (action.type) {
    case 'SET_PHONE_NUMBER':
      console.log('_phoneNumber state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _birthday(state=initialBirthdayState, action) {
  switch (action.type) {
    case 'SET_BIRTHDAY':
      console.log('_birthday state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _streetAddress(state=initialStreetAddressState, action) {
  switch (action.type) {
    case 'SET_STREET_ADDRESS':
      console.log('_streetAddress state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _aptSuite(state=initialAptSuiteState, action) {
  switch (action.type) {
    case 'SET_APT_SUITE':
      console.log('_aptSuite state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _city(state=initialCityState, action) {
  switch (action.type) {
    case 'SET_CITY':
      console.log('_city state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _state(state=initialStateState, action) {
  switch (action.type) {
    case 'SET_STATE':
      console.log('_state state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _zipcode(state=initialZipcodeState, action) {
  switch (action.type) {
    case 'SET_ZIPCODE':
      console.log('_zipcode state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isFirstNameEmpty(state=initialIsFirstNameEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_FIRST_NAME_EMPTY':
      console.log('_isFirstNameEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isLastNameEmpty(state=initialIsLastNameEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_LAST_NAME_EMPTY':
      console.log('_isLastNameEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isPhoneNumberEmpty(state=initialIsPhoneNumberEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_PHONE_NUMBER_EMPTY':
      console.log('_isPhoneNumberEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isBirthdayEmpty(state=initialIsBirthdayEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_BIRTHDAY_EMPTY':
      console.log('_isBirthdayEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isStreetAddressEmpty(state=initialIsStreetAddressEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_STREET_ADDRESS_EMPTY':
      console.log('_isStreetAddressEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isCityEmpty(state=initialIsCityEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_CITY_EMPTY':
      console.log('_isCityEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isStateEmpty(state=initialIsStateEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_STATE_EMPTY':
      console.log('_isStateEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _isZipcodeEmpty(state=initialIsZipcodeEmptyState, action) {
  switch (action.type) {
    case 'SET_IS_ZIPCODE_EMPTY':
      console.log('_isZipcodeEmpty state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}

export function _areThereEmptyFields(state=initialAreThereEmptyFieldsState, action) {
  switch (action.type) {
    case 'SET_ARE_THERE_EMPTY_FIELDS':
      console.log('_areThereEmptyFields state called with state: ', state, 'and action: ', action);
      return action.text;

    default:
      return state
  }
}

export function _isInvalidState(state=initialIsInvalidStateState, action) {
  switch (action.type) {
    case 'SET_IS_INVALID_STATE':
      console.log('_isInvalidState state called with state: ', state, 'and action: ', action);
      return action.bool;

    default:
      return state
  }
}
