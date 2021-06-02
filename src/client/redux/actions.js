import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { APP_CONST, UI_CONST } from '../constants.js';



export const actionSetTabIndex = createAction('SetTabIndex');
export const actionSetAccessRole = createAction('SetAccessRole');
export const actionIncreaseTabPageIndex = createAction('IncreaseTabPageIndex');
export const actionResetTab = createAction('ResetSearchTab');
export const actionSetHasMoreOnTab = createAction('SetHasMoreOnTab', (tabIndex, hasMore) => {
  return {
    payload: {
      tabIndex,
      hasMore,
    },
  };
});


export const actionGetProductCategory = createAsyncThunk(
  'GetProductCategor',
  async (arg, thunkApi) => {
    try {
      const result = await axios.post('/api/proxy', { method: 'GET', url: APP_CONST.GOODS_CATEGORY_EP });
      return result.data.Data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);




export const actionGetCollectionProducts = createAsyncThunk(
  'GetCollectionProducts',
  async (arg, thunkApi) => {
    try {
      const pageIndex = thunkApi.getState().ui.dataLoadingStatus.collectionTab.currentPageIndex;
      // const EndpointOfCollectionProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodIsNew":true},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
      // const EndpointOfCollectionProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodPurchaseSource":"costco"},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
      const result = await axios.post('/api/getcollections', { pageIndex, pageSize: APP_CONST.PAGE_SIZE });
      const realData = result.data;
      if (realData.length < APP_CONST.PAGE_SIZE) {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.COLLECTION_TAB_INDEX, false));
      }
      else {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.COLLECTION_TAB_INDEX, true));
      }
      thunkApi.dispatch(actionIncreaseTabPageIndex(UI_CONST.COLLECTION_TAB_INDEX));
      return realData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

export const actionGetSearchResults = createAsyncThunk(
  'GetSearchResults',
  async (keyword, thunkApi) => {
    try {
      const pageIndex = thunkApi.getState().ui.dataLoadingStatus.searchTab.currentPageIndex;
      const url = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"SearchKeys":"${keyword}","GodPurchaseSource":"costco"},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
      const result = await axios.post('/api/proxy', { method: 'POST', url });
      const realData = result.data.Data.DataBody;
      if (realData.length < APP_CONST.PAGE_SIZE) {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.SEARCH_TAB_INDEX));
      }
      else {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.SEARCH_TAB_INDEX, true));
      }
      thunkApi.dispatch(actionIncreaseTabPageIndex(UI_CONST.SEARCH_TAB_INDEX));
      return realData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

export const actionGetCategoryProducts = createAsyncThunk(
  'GetCategoryProducts',
  async (categoryIndex, thunkApi) => {
    try {
      const productCategory = thunkApi.getState().data.productCategory;
      const pageIndex = thunkApi.getState().ui.dataLoadingStatus.categoryTab.currentPageIndex;
      const url = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodCategoryCode":"${productCategory[categoryIndex].MgcCode}"},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
      const result = await axios.post('/api/proxy', { method: 'GET', url });
      const realData = result.data.Data.DataBody;
      if (realData.length < APP_CONST.PAGE_SIZE) {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.CATEGORY_TAB_INDEX, false));
      }
      else {
        thunkApi.dispatch(actionSetHasMoreOnTab(UI_CONST.CATEGORY_TAB_INDEX, true));
      }
      thunkApi.dispatch(actionIncreaseTabPageIndex(UI_CONST.CATEGORY_TAB_INDEX));
      return realData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);