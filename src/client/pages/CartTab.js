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

import { actionSetApiLoading, actionSetSnackbar } from '../redux/actions.js';
import { APP_CONST } from '../constants.js';
import { mDelay } from '../utils.js';
import { ItemCard } from '../components/ItemCard.js';

export const CartTab = (props) => {
  const dispatch = useDispatch();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [newOrders, setNewOrders] = React.useState([]);
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

  const buildReq = (item) => {
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
      "OrdAppTotalMoney": item.productNum * item.productDetails.GodPresentPrice,
      "OrdAppCouponMoney": 0,
      "OrdAppPaymentMoney": item.productNum * item.productDetails.GodPresentPrice,
      "OrdAppCouponCode": "",
      "EcmOrderGoodsInfos": [
        {
          "OgoGoodsCode": item.productDetails.GodCode,
          "OgoBarcode": item.productDetails.GodBarcode,
          "OgoName": item.productDetails.GodName,
          "OgoGoodsTitle": item.productDetails.GodAppTitle,
          "OgoBrand": item.productDetails.GodBrand,
          "OgoNumber": item.productNum.toString(),
          "OgoPrice": item.productDetails.GodPresentPrice,
          "OgoTotalPrice": item.productNum * item.productDetails.GodPresentPrice
        },
      ],
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

    const totalCost = cart.reduce((a, item) => a + item.productNum * item.productDetails.GodPresentPrice, 0);

    const ret = await cart.reduce(async (a, item) => {
      let acc = undefined;
      try {
        // This line MUST be here at the beginning.
        acc = await a;
        await mDelay(500);
        const EndpointOfAddOrder = `https://www.snailsmall.com/Order/Add?data=${JSON.stringify(buildReq(item))}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
        const result = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfAddOrder });
        if (result.data.ResCode != '01') {
          throw new Error(result.data.ResMessage);
        }
        //Backup the revenue and customerservice index.
        if (mustProvideRevenue) {
          const partialRevenue = item.productNum * item.productDetails.GodPresentPrice / totalCost * parseFloat(revenueRef.current.value);
          result.data.Data._revenue = partialRevenue;
          result.data.Data._customerService = customerServiceIndex;
          await axios.post('/api/addorder', { data: result.data.Data });
        }

        return [...acc, result.data.Data];
      }
      catch (err) {
        return [...acc, { error: err.message }];
      }
    }, []);

    const _newOrder = ret.map((order, i) => {
      if (order.error) {
        return {
          productName: cart[i].productDetails.GodAppTitle,
          productImage: cart[i].productDetails.GodImageUrl,
          productNumber: cart[i].productNum,
          orderCode: null,
          error: order.error,
        };
      }
      else {
        return {
          productName: order.EcmOrderGoodsInfos[0].OgoGoodsTitle,
          productImage: order.EcmOrderGoodsInfos[0].OgoGoodsImageUrl,
          productNumber: order.EcmOrderGoodsInfos[0].OgoNumber,
          orderCode: order.OrdCode,
          error: null,
        };
      }
    });
    dispatch(actionSetApiLoading(false));
    setNewOrders(_newOrder);
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
    {newOrders.map((order, i) => <OrderSummary key={i} details={order} />)}
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
          <ListItemAvatar>
            <Avatar src={details.productImage} />
          </ListItemAvatar>

          <ListItemText
            primary={details.productName}
            secondary={`数量：${details.productNumber}`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon >
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary= {details.error === null ? '订单号' : '错误信息'}
            secondary={details.error === null ? details.orderCode : details.error}
          />
        </ListItem>
      </CardContent>
    </Card>
  );

};
