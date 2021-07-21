import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ItemCard } from '../components/ItemCard';
import {
  actionSetSnackbar,
  actionSetApiLoading
} from '../redux/actions.js';

export const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState(null);
  const isLoading = useSelector(state => state.ui.isApiLoading);

  const fetchProductDetailsById = async (productId) => {
    try {
      dispatch(actionSetApiLoading(true));
      const EndpointOfFindProduct = `https://www.snailsmall.com/Goods/GetById?data={"GodId":${productId}}`;
      const result = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfFindProduct });
      if (result.data.ResCode === '01') {
        setProductDetails(result.data.Data);
      }
      else {
        throw new Error('无效的商品ID！');
      }

      dispatch(actionSetApiLoading(false));
    }
    catch (err) {
      console.log(err);
      dispatch(actionSetApiLoading(false));
      dispatch(actionSetSnackbar({
        visible: true,
        message: err.message,
        autoHideDuration: 5000,
      }));
      setProductDetails(null);
    }
  };

  useEffect(() => {
    fetchProductDetailsById(id);
  }, []);

  return (<>
    {productDetails && (<>
      {isLoading && <LinearProgress />}
      <ItemCard
        disableExpand={true}
        defaultExpanded='more'
        details={productDetails} />
    </>)}

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
