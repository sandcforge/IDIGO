import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { ItemCard } from '../components/ItemCard';
import { APP_CONST } from '../constants.js';
import { actionSetApiLoading } from '../redux/actions.js';

export const ProductPage = () => {
  const { code } = useParams();
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState(null);

  const fetchProductDetailsByCode = async (productCode) => {
    try {
      dispatch(actionSetApiLoading(true));
      const EndpointOfFindOrder = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodCode":"${productCode}"},"PageIndex":0,"PageSize":1}`;
      const result0 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfFindOrder });
      const productList = result0.data.Data.DataBody;
      let productDetails = null;
      if (productList && productList[0]) {
        console.log(productList[0]);
        setProductDetails(productList[0]);
      }
      else {
        throw new Error('Invalid orderCode');
      }

      dispatch(actionSetApiLoading(false));
    }
    catch (err) {
      console.log(err);
      dispatch(actionSetApiLoading(false));
      setProductDetails(null);
    }
  };

  useEffect(() => {
    fetchProductDetailsByCode(code);
  }, []);



  return (<>
    {productDetails ? (
      <ItemCard 
        disableExpand={true}
        defaultExpanded = {true}
        details={productDetails} />)
      : '商品不存在!'}
  </>);
};
