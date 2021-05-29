import {UI_CONST} from '../constants.js';
import {ACTION_TYPE} from './actions.js';
const initialState = {
  ui: {
    homePageTabIndex: UI_CONST.HOME_PAGE_TAB_INDEX,
  },
};

// Use the initialState as a default value
export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_TAB_INDEX:
      return {
        ...state,
        ui: {
          ...state.ui,
          homePageTabIndex: action.payload.index,
        },
      };

    default:
      return state;
  };
};