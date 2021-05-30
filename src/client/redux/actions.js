import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { APP_CONST } from '../constants.js';


export const actionSetTabIndex = createAction('SET_TAB_INDEX');

export const actionGetProductCategory = createAsyncThunk(
  'GET_PRODUCT_CATEGORY',
  async () => {
    try {
      const result = await axios.post('/api/proxy',{method: 'GET', url: APP_CONST.GOODS_CATEGORY_EP});
      return result.data.Data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);
