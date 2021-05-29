export const ACTION_TYPE = {
  SET_TAB_INDEX: 'SET_TAB_INDEX',
};

const setTabIndex = tabIndex => ({
  type: ACTION_TYPE.SET_TAB_INDEX,
  payload: {
    index: tabIndex,
  },
});

export const actions = {
  setTabIndex,
};