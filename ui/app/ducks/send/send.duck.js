// Actions
const OPEN_TO_DROPDOWN = 'metamask/send/OPEN_TO_DROPDOWN'
const CLOSE_TO_DROPDOWN = 'metamask/send/CLOSE_TO_DROPDOWN'
const UPDATE_SEND_ERRORS = 'metamask/send/UPDATE_SEND_ERRORS'
const RESET_SEND_STATE = 'metamask/send/RESET_SEND_STATE'
const SHOW_GAS_BUTTON_GROUP = 'metamask/send/SHOW_GAS_BUTTON_GROUP'
const HIDE_GAS_BUTTON_GROUP = 'metamask/send/HIDE_GAS_BUTTON_GROUP'

// TODO: determine if this approach to initState is consistent with conventional ducks pattern
const initState = {
  toDropdownOpen: false,
  gasButtonGroupShown: true,
  errors: {},
}

// Reducer
export default function reducer ({ send: sendState = initState }, action = {}) {
  const newState = { ...sendState }

  switch (action.type) {
    case OPEN_TO_DROPDOWN:
      return {
        ...newState,
        toDropdownOpen: true,
      }
    case CLOSE_TO_DROPDOWN:
      return {
        ...newState,
        toDropdownOpen: false,
      }
    case UPDATE_SEND_ERRORS:
      return {
        ...newState,
        errors: {
          ...newState.errors,
          ...action.value,
        },
      }
    case SHOW_GAS_BUTTON_GROUP:
      return {
        ...newState,
        gasButtonGroupShown: true,
      }
    case HIDE_GAS_BUTTON_GROUP:
      return {
        ...newState,
        gasButtonGroupShown: false,
      }
    case RESET_SEND_STATE:
      return { ...initState }
    default:
      return newState
  }
}

// Action Creators
export function openToDropdown () {
  return { type: OPEN_TO_DROPDOWN }
}

export function closeToDropdown () {
  return { type: CLOSE_TO_DROPDOWN }
}

export function showGasButtonGroup () {
  return { type: SHOW_GAS_BUTTON_GROUP }
}

export function hideGasButtonGroup () {
  return { type: HIDE_GAS_BUTTON_GROUP }
}

export function updateSendErrors (errorObject) {
  return {
    type: UPDATE_SEND_ERRORS,
    value: errorObject,
  }
}

export function resetSendState () {
  return { type: RESET_SEND_STATE }
}
