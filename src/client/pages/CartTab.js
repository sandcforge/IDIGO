import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ItemCard } from '../components/ItemCard.js';


export const CartTab = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.ui.cart);
  return (<>{
    cart.map(item => <ItemCard key={item.productDetails.GodId} details={item.productDetails} />)
  }
  </>);
};