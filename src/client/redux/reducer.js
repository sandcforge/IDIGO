import { createReducer } from '@reduxjs/toolkit';

import {UI_CONST} from '../constants.js';
import {actionGetProductCategory, actionSetTabIndex} from './actions.js';
const initialState = {
  ui: {
    homePageTabIndex: UI_CONST.HOME_PAGE_TAB_INDEX,
  },
  data: {
    productCategory: [],
  },
};


export const rootReducer = createReducer( initialState, (builder) => {
  builder
    .addCase(actionSetTabIndex, (state, action) => {
      state.ui.homePageTabIndex = action.payload;
    })
    .addCase(actionGetProductCategory.fulfilled, (state, action) => {
      state.data.productCategory = action.payload;
    })
    .addCase(actionGetProductCategory.rejected, (state, action) => {
      state.data.productCategory = action.payload;
    });
});