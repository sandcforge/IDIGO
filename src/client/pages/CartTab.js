import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import TelegramIcon from '@material-ui/icons/Telegram';

import { actionResetCart, actionSetApiLoading, actionSetSnackbar } from '../redux/actions.js';
import { APP_CONST } from '../constants.js';
import { ItemCard } from '../components/ItemCard.js';

export const CartTab = (props) => {
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [newOrder, setNewOrder] = React.useState(null);
  const isAdmin = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);
  const isCustomerService = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_CUSTOMER_SERVICE);
  const mustProvideRevenue = isAdmin || isCustomerService;
  const customerServiceIndex = useSelector(state => state.app.customerService);

  const handleClickAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const cart = useSelector(state => state.ui.cart);
  const memoRef = useRef(null);
  const revenueRef = useRef(null);

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
      "OrdReceiverPost": '',
      "OrdReceiverProvince": "备注",
      "OrdReceiverCity": "备注",
      "OrdReceiverCounty": "备注",
      "OrdReceiverAddress": '详细收件人信息填写在备注里',
      "OrdRemark": memoRef.current.value,
      "OrdAppTotalMoney": totalPrice,
      "OrdAppCouponMoney": 0,
      "OrdAppPaymentMoney": totalPrice,
      "OrdAppCouponCode": "",
      "EcmOrderGoodsInfos": productList,
    };
    return ret;
  };

  const presubmitOrder = () => {
    try {
      // Data Validation
      const totalProductInCart = cart.reduce((accumulator, item) => {
        return accumulator + item.productNum;
      }, 0);

      if (totalProductInCart <= 0) {
        throw new Error('购物车不能为空！');
      }
      if (memoRef.current.value === '') {
        throw new Error('收件人信息不能为空！');
      }
      if (mustProvideRevenue
        && (revenueRef.current.value === ''
          || isNaN(revenueRef.current.value)
          || parseFloat(revenueRef.current.value) < 0)) {
        throw new Error('价格填写错误！');
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

    try {
      const EndpointOfAddOrder = `https://www.snailsmall.com/Order/Add?data=${JSON.stringify(buildReq())}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
      const result = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfAddOrder });
      if (result.data.ResCode != '01') {
        throw new Error(result.data.ResMessage);
      }

      //Backup the revenue and customerservice index.
      if (mustProvideRevenue) {
        result.data.Data._revenue = parseFloat(revenueRef.current.value);
        result.data.Data._customerService = customerServiceIndex;
        await axios.post('/api/addorder', { data: result.data.Data });
      }
      dispatch(actionSetApiLoading(false));
      dispatch(actionResetCart());
      setNewOrder(result.data.Data);
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
    {mustProvideRevenue
      &&
      <Box my={1}>
        <TextField
          fullWidth={true}
          label="实际收款"
          multiline={true}
          variant="outlined"
          inputRef={revenueRef}
        />
      </Box>}
    {cart.map(item => <ItemCard key={item.productDetails.GodId} details={item.productDetails} />)}
    <Button
      variant="contained"
      fullWidth={true}
      color="primary"
      startIcon={<TelegramIcon />}
      onClick={presubmitOrder}
    >
      提交订单
    </Button>
    {newOrder && <OrderSummary details={newOrder} />}
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



const classes = {
  root: {
    maxWidth: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  subheaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
};


const OrderSummary = (prop) => {
  const { details } = prop;

  return (
    <Card style={classes.root}>
      <CardContent>
        <ListItem>
          <ListItemIcon >
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary={'订单号'}
            secondary={details.OrdCode}
          />
        </ListItem>
      </CardContent>
    </Card>
  );

};
