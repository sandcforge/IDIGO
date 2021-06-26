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
      const EndpointOfFindProduct = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodId":"${productId}"},"PageIndex":0,"PageSize":1}`;
      const result0 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfFindProduct });
      const productList = result0.data.Data.DataBody;
      if (productList && productList[0]) {
        setProductDetails(productList[0]);
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
        defaultExpanded={true}
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
