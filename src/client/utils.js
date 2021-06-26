import {BUSINESS_CONST, APP_CONST} from './constants.js';
import { store } from './redux/store.js';

const isAdmin = store.getState().app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN;
export const getBuyerPrice = (cost) => {
  return (cost * (isAdmin ? 1 : BUSINESS_CONST.GOODS_PROFIT)).toFixed(2);
}
