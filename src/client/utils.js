import {BUSINESS_CONST, APP_CONST} from './constants.js';
import { store } from './redux/store.js';


export const getBuyerPrice = (cost) => {
  const isAdmin = store.getState().app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN;
  const isCustomerService = store.getState().app.accessRole === APP_CONST.ACCESS_ROLE_CUSTOMER_SERVICE;
  const cond = isCustomerService || isAdmin;
  return (cost * (cond ? 1 : BUSINESS_CONST.GOODS_PROFIT)).toFixed(2);
}
