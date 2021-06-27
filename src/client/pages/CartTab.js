import { Button } from '@material-ui/core';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ItemCard } from '../components/ItemCard.js';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { actionSetApiLoading, actionSetSnackbar } from '../redux/actions.js';
import { APP_CONST } from '../constants.js';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


export const CartTab = (props) => {
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [newOrderCode, setNewOrderCode] = React.useState(null);
  const totalProductInCart = useSelector(state => {
    return state.ui.cart.reduce((accumulator, item) => {
      return accumulator + item.productNum;
    }, 0);
  });

  const handleClickAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const cart = useSelector(state => state.ui.cart);
  const memoRef = useRef(null);

  const buildReq = () => {
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
    const totalPrice = productList.reduce((a, item) => a + item.OgoTotalPrice, 0);
    const ret = {
      "OrdReceiverName": '便捷地址',
      "OrdReceiverMobile": '11111111111',
      "OrdReceiverCardNo": '',
      "OrdReceiverPost": "",
      "OrdReceiverProvince": "备注",
      "OrdReceiverCity": "备注",
      "OrdReceiverCounty": "备注",
      "OrdReceiverAddress": '详细收件人信息填写在备注里',
      "OrdRemark": memoRef.current.value,
      "OrdAppTotalMoney": totalPrice,
      "OrdAppCouponMoney": 0,
      "OrdAppPaymentMoney": totalPrice,
      "OrdAppCouponCode": "",
      "EcmOrderGoodsInfos": productList
    };
    console.log(ret);
    return ret;
  };

  const presubmitOrder = () => {
    try {
      // Data Validation
      if (totalProductInCart <= 0) {
        throw new Error('购物车不能为空！');
      }
      handleClickAlertOpen();
    }
    catch (err) {
      dispatch(actionSetSnackbar({
        visible: true,
        message: err.message,
        autoHideDuration: 3000,
      }));
    }
  };

  const submitOrder = async () => {
    handleAlertClose();
    dispatch(actionSetApiLoading(true));
    const EndpointOfAddOrder = `https://www.snailsmall.com/Order/Add?data=${JSON.stringify(buildReq())}&buyercode=${APP_CONST.MY_BUYER_CODE}`
    try {
      const result = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfAddOrder });
      if (result.data.ResCode == '01') {
        setNewOrderCode(result.data.Data.OrdCode);
      }
      else {
        throw new Error(result.data.ResMessage);
      }
      dispatch(actionSetApiLoading(false));
    }
    catch (err) {
      dispatch(actionSetApiLoading(false));
      dispatch(actionSetSnackbar({
        visible: true,
        message: err.message,
        autoHideDuration: 5000,
      }));
    }

  };
  return (<>
    <Box my={1}>
      <TextField
        fullWidth={true}
        label="收件人信息"
        multiline={true}
        variant="outlined"
        inputRef={memoRef}
      />
    </Box>
    {cart.map(item => <ItemCard key={item.productDetails.GodId} details={item.productDetails} />)}
    <Button
      variant="contained"
      fullWidth={true}
      color="primary"
      startIcon={<SearchIcon />}
      onClick={presubmitOrder}
    >
      添加订单
    </Button>
    {newOrderCode && `新订单号为：${newOrderCode}，请在订单页查询状态。`}
    <Dialog
      open={alertOpen}
      onClose={handleAlertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">确认该订单？</DialogTitle>
      <DialogActions>
        <Button onClick={handleAlertClose} color="primary" autoFocus>
          取消
        </Button>
        <Button onClick={submitOrder} color="primary">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  </>);
};
