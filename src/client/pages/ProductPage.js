import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import { ItemCard } from '../components/ItemCard';
import { actionSetApiLoading } from '../redux/actions.js';

export const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState(null);

  const fetchProductDetailsById = async (productId) => {
    try {
      dispatch(actionSetApiLoading(true));
      const EndpointOfFindProduct = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodId":"${productId}"},"PageIndex":0,"PageSize":1}`;
      const result0 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfFindProduct });
      const productList = result0.data.Data.DataBody;
      if (productList && productList[0]) {
        setProductDetails(productList[0]);
      }
      else {
        throw new Error('Invalid Product Id');
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
    fetchProductDetailsById(id);
  }, []);

  return (<>
    {productDetails ? (
      <ItemCard
        disableExpand={true}
        defaultExpanded={true}
        details={productDetails} />)
      : '商品不存在!'}

    <Button
      variant="contained"
      color="primary"
      component={Link} to={'/'}
      fullWidth={true}
    >
      点击这里，发现更多好货!
    </Button>

  </>);
};
