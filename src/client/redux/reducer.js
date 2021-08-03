import { createReducer } from '@reduxjs/toolkit';

import { APP_CONST, UI_CONST } from '../constants.js';
import {
  actionGetProductCategory,
  actionGetCollectionProducts,
  actionGetSearchResults,
  actionSetTabIndex,
  actionSetAccessRole,
  actionIncreaseTabPageIndex,
  actionResetTab,
  actionSetHasMoreOnTab,
  actionGetCategoryProducts,
  actionSetApiLoading,
  actionSetCustomerService,
  actionUpdateCart,
  actionResetCart,
  actionSetSnackbar,
  actionGetPruductMisc,
  actionAddProductToCollection,
  actionRemoveProductFromCollection,
  actionUpdateProductCopyWriting,
} from './actions.js';

const initialState = {
  ui: {
    isApiLoading: false,
    snackbar: {
      visible: false,
      message: '',
      autoHideDuration: 1000,
    },
    homePageTabIndex: UI_CONST.COLLECTION_TAB_INDEX,
    dataLoadingStatus: {
      collectionTab: {
        currentPageIndex: 0,
        hasMore: false,
      },
      categoryTab: {
        currentPageIndex: 0,
        hasMore: false,
      },
      searchTab: {
        currentPageIndex: 0,
        hasMore: false,
      },
    },
    cart: [],
  },
  data: {
    productCategory: [],
    collectionProducts: [],
    categoryProducts: [],
    searchResults: [],
    productMisc: [],
  },
  app: {
    accessRole: APP_CONST.ACCESS_ROLE_USER,
    customerService: APP_CONST.CUSTOMER_SERVICE_NULL,
  }
};


export const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actionSetAccessRole, (state, action) => {
      state.app.accessRole = action.payload;
    })
    .addCase(actionSetCustomerService, (state, action) => {
      state.app.customerService = action.payload;
    })
    .addCase(actionSetApiLoading, (state, action) => {
      state.ui.isApiLoading = action.payload;
    })
    .addCase(actionSetSnackbar, (state, action) => {
      const { visible, message, autoHideDuration } = action.payload;
      if (visible !== undefined) { state.ui.snackbar.visible = visible; }
      if (message !== undefined) { state.ui.snackbar.message = message; }
      if (autoHideDuration !== undefined) { state.ui.snackbar.autoHideDuration = autoHideDuration; }
    })
    .addCase(actionSetTabIndex, (state, action) => {
      state.ui.homePageTabIndex = action.payload;
    })
    .addCase(actionIncreaseTabPageIndex, (state, action) => {
      switch (action.payload) {
        case UI_CONST.COLLECTION_TAB_INDEX:
          state.ui.dataLoadingStatus.collectionTab.currentPageIndex += 1;
          break;
        case UI_CONST.CATEGORY_TAB_INDEX:
          state.ui.dataLoadingStatus.categoryTab.currentPageIndex += 1;
          break;
        case UI_CONST.SEARCH_TAB_INDEX:
          state.ui.dataLoadingStatus.searchTab.currentPageIndex += 1;
          break;
      }

    })
    .addCase(actionSetHasMoreOnTab, (state, action) => {
      switch (action.payload.tabIndex) {
        case UI_CONST.COLLECTION_TAB_INDEX:
          state.ui.dataLoadingStatus.collectionTab.hasMore = action.payload.hasMore;
          break;
        case UI_CONST.CATEGORY_TAB_INDEX:
          state.ui.dataLoadingStatus.categoryTab.hasMore = action.payload.hasMore;
          break;
        case UI_CONST.SEARCH_TAB_INDEX:
          state.ui.dataLoadingStatus.searchTab.hasMore = action.payload.hasMore;
          break;
      }
    })
    .addCase(actionResetTab, (state, action) => {
      switch (action.payload) {
        case UI_CONST.COLLECTION_TAB_INDEX:
          state.ui.dataLoadingStatus.collectionTab = {
            currentPageIndex: 0,
            hasMore: false,
          };
          state.data.collectionProducts = [];
          break;
        case UI_CONST.CATEGORY_TAB_INDEX:
          state.ui.dataLoadingStatus.categoryTab = {
            currentPageIndex: 0,
            hasMore: false,
          };
          state.data.categoryProducts = [];
          break;
        case UI_CONST.SEARCH_TAB_INDEX:
          state.ui.dataLoadingStatus.searchTab = {
            currentPageIndex: 0,
            hasMore: false,
          };
          state.data.searchResults = [];
          break;
      }
    })
    .addCase(actionResetCart, (state, action) => {
      state.ui.cart = [];
    })
    .addCase(actionUpdateCart, (state, action) => {
      const { productDetails, productNum } = action.payload;
      const index = state.ui.cart.findIndex(
        item => item.productDetails.GodCode === productDetails.GodCode);
      if (index < 0) {
        if (productNum > 0) {
          state.ui.cart.push(action.payload);
        }
      }
      else {
        if (productNum + state.ui.cart[index].productNum > 0) {
          state.ui.cart[index].productNum += productNum;
        }
        else {
          state.ui.cart.splice(index, 1);
        }
      }
    })
    .addCase(actionGetProductCategory.fulfilled, (state, action) => {
      state.data.productCategory = action.payload;
    })
    .addCase(actionGetPruductMisc.fulfilled, (state, action) => {
      state.data.productMisc = action.payload;
    })
    .addCase(actionGetCollectionProducts.fulfilled, (state, action) => {
      state.data.collectionProducts = state.data.collectionProducts.concat(action.payload);
    })
    .addCase(actionGetCategoryProducts.fulfilled, (state, action) => {
      state.data.categoryProducts = state.data.categoryProducts.concat(action.payload);
    })
    .addCase(actionGetSearchResults.fulfilled, (state, action) => {
      state.data.searchResults = state.data.searchResults.concat(action.payload);
    })
    .addCase(actionAddProductToCollection.fulfilled, (state, action) => {
      state.data.collectionProducts.push(action.payload);
    })
    .addCase(actionRemoveProductFromCollection.fulfilled, (state, action) => {
      const index_ = state.data.collectionProducts.findIndex(i => i.GodId === action.payload.GodId);
      if (index_ !== -1) {
        state.data.collectionProducts.splice(index_, 1);
      }
    })
    .addCase(actionUpdateProductCopyWriting.fulfilled, (state, action) => {
      const index_ = state.data.productMisc.findIndex(i => i.GodId === action.payload.GodId);
      if (index_ !== -1) {
        state.data.productMisc.push(action.payload);
      }
      else {
        state.data.productMisc[index_] = action.payload;
      }
    });
});
