import { BUSINESS_CONST, APP_CONST, UI_CONST } from './constants.js';
import { store } from './redux/store.js';


export const getBuyerPrice = (cost) => {
  const isAdmin = store.getState().app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN;
  const isCustomerService = store.getState().app.accessRole === APP_CONST.ACCESS_ROLE_CUSTOMER_SERVICE;
  const cond = isCustomerService || isAdmin;
  return (cost * (cond ? 1 : BUSINESS_CONST.GOODS_PROFIT)).toFixed(2);
}

export const showLoadMoreButtonOnTab = (tabIndex) => {
  const dataLoadingStatus = store.getState().ui.dataLoadingStatus;
  let ret = false;
  switch (tabIndex) {
    case UI_CONST.COLLECTION_TAB_INDEX:
      ret = dataLoadingStatus.collectionTab.currentPageIndex !== 0 && dataLoadingStatus.collectionTab.hasMore === true;
      break;
    case UI_CONST.CATEGORY_TAB_INDEX:
      ret = dataLoadingStatus.categoryTab.currentPageIndex !== 0 && dataLoadingStatus.categoryTab.hasMore === true;
      break;
    case UI_CONST.SEARCH_TAB_INDEX:
      ret = dataLoadingStatus.searchTab.currentPageIndex !== 0 && dataLoadingStatus.searchTab.hasMore === true;
      break;
  }
  return ret;
}

export const mDelay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const mergeWithProductMisc = (productList) => {
  const _productMisc = store.getState().data.productMisc;
  const m = new Map();
  productList.map((x) => { m.set(x.GodId, x); });
  _productMisc.map((x) => {
    if (m.get(x.GodId)) {
      m.set(x.GodId, { ...m.get(x.GodId), _: x });
    }
  });
  return Array.from(m.values());
}