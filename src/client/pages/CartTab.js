import { Button } from '@material-ui/core';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ItemCard } from '../components/ItemCard.js';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';


export const CartTab = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.ui.cart);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const idCardRef = useRef(null);
  const addressRef = useRef(null);
  const memoRef = useRef(null);

  const submitOrder = async () => {
    const productList = cart.map(item => ({
      "OgoGoodsCode": item.productDetails.GodCode,
      "OgoBarcode": item.productDetails.GodBarcode,
      "OgoName": item.productDetails.GodName,
      "OgoGoodsTitle": item.productDetails.GodAppTitle,
      "OgoBrand": item.productDetails.GodBrand,
      "OgoNumber": item.productNum.toString(),
      "OgoPrice": item.productDetails.GodPresentPrice,
      "OgoTotalPrice": item.productNum * item.productDetails.GodPresentPrice
    }));
    const totalPrice = productList.reduce((a,item)=> a + item.OgoTotalPrice, 0 );
    const ret = {
      "OrdReceiverName": nameRef.current.value,
      "OrdReceiverMobile": phoneRef.current.value,
      "OrdReceiverCardNo": idCardRef.current.value,
      "OrdReceiverPost": "",
      "OrdReceiverProvince": "备注",
      "OrdReceiverCity": "备注",
      "OrdReceiverCounty": "备注",
      "OrdReceiverAddress": addressRef.current.value,
      "OrdRemark": memoRef.current.value,
      "OrdAppTotalMoney": totalPrice,
      "OrdAppCouponMoney": 0,
      "OrdAppPaymentMoney": totalPrice,
      "OrdAppCouponCode": "",
      "EcmOrderGoodsInfos": productList
    };
    console.log(ret);
  };
  return (<>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="收件人姓名"
        variant="outlined"
        inputRef={nameRef}
      />
    </Box>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="收件人电话"
        variant="outlined"
        inputRef={phoneRef}
      />
    </Box>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="收件人身份证"
        variant="outlined"
        inputRef={idCardRef}
      />
    </Box>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="收件人地址"
        variant="outlined"
        inputRef={addressRef}
      />
    </Box>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="备注"
        variant="outlined"
        inputRef={memoRef}
      />
    </Box>

    {
      cart.map(item => <ItemCard key={item.productDetails.GodId} details={item.productDetails} />)
    }

    <Button
      variant="contained"
      fullWidth={true}
      color="primary"
      startIcon={<SearchIcon />}
      onClick={submitOrder}
    >
      添加订单
    </Button>
  </>);
};