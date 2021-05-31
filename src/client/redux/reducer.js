import { createReducer } from '@reduxjs/toolkit';

import { UI_CONST } from '../constants.js';
import {
  actionGetProductCategory,
  actionGetCollectionProducts,
  actionGetSearchResults,
  actionSetTabIndex,
  actionIncreaseTabPageIndex,
  actionFlagNoMoreOnTab,
  actionResetSearchTab,
  actionSetHasMoreOnTab,
} from './actions.js';

const initialState = {
  ui: {
    homePageTabIndex: UI_CONST.COLLECTION_TAB_INDEX,
    dataLoadingStatus: {
      collectionTab: {
        currentPageIndex: 0,
        hasMore: false,
      },
      searchTab: {
        currentPageIndex: 0,
        hasMore: false,
      },
      categoryTab: [],
    }
  },
  data: {
    productCategory: [],
    collectionProducts: [],
    searchResults: [],
  },
};


export const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actionSetTabIndex, (state, action) => {
      state.ui.homePageTabIndex = action.payload;
    })
    .addCase(actionIncreaseTabPageIndex, (state, action) => {
      switch (action.payload) {
        case UI_CONST.COLLECTION_TAB_INDEX:
          state.ui.dataLoadingStatus.collectionTab.currentPageIndex += 1;
          break;
        case UI_CONST.SEARCH_TAB_INDEX:
          state.ui.dataLoadingStatus.searchTab.currentPageIndex += 1;
      }

    })
    .addCase(actionSetHasMoreOnTab, (state, action) => {
      switch (action.payload.tabIndex) {
        case UI_CONST.COLLECTION_TAB_INDEX:
          state.ui.dataLoadingStatus.collectionTab.hasMore = action.payload.hasMore;
          break;
        case UI_CONST.SEARCH_TAB_INDEX:
          state.ui.dataLoadingStatus.searchTab.hasMore = action.payload.hasMore;
      }
    })
    .addCase(actionResetSearchTab, (state, action) => {
      state.ui.dataLoadingStatus.searchTab = {
        currentPageIndex: 0,
        hasMore: false,
      };
      state.data.searchResults = [];
    })
    .addCase(actionGetProductCategory.fulfilled, (state, action) => {
      state.data.productCategory = action.payload;
    })
    .addCase(actionGetCollectionProducts.fulfilled, (state, action) => {
      state.data.collectionProducts = state.data.collectionProducts.concat(action.payload);
    })
    .addCase(actionGetSearchResults.fulfilled, (state, action) => {
      state.data.searchResults = state.data.searchResults.concat(action.payload);
    });
});