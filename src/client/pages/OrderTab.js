import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import EventIcon from '@material-ui/icons/Event';
import SearchIcon from '@material-ui/icons/Search';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ViewListIcon from '@material-ui/icons/ViewList';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CreditCardIcon from '@material-ui/icons/CreditCard';

import { FolderCard } from '../components/FolderCard.js';
import { APP_CONST } from '../constants.js';
import { actionSetApiLoading, actionSetSnackbar } from '../redux/actions.js';


export const OrderTab = (props) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderCodeTextFieldValue, setOrderCodeTextFieldValue] = useState('');
  const [receiverPhoneTextFieldValue, setReceiverPhoneTextFieldValue] = useState('');

  const mustProvideReceiverPhone = useSelector(state => state.app.accessRole !== APP_CONST.ACCESS_ROLE_ADMIN);
  const showExpressOrderNumber = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);

  const dispatch = useDispatch();

  const handleOrderCodeTextFieldOnChange = (event) => {
    setOrderCodeTextFieldValue(event.target.value);
  };

  const handleReceiverPhoneTextFieldOnChange = (event) => {
    setReceiverPhoneTextFieldValue(event.target.value);
  };

  const fetchOrderDetails = async (orderCode) => {
    try {
      //Validation Data before submission.
      if (isNaN(orderCodeTextFieldValue)) {
        throw new Error('无效的订单号！');
      }
      if (mustProvideReceiverPhone
        && (isNaN(receiverPhoneTextFieldValue)
          || receiverPhoneTextFieldValue.toString().length < 8)) {
        throw new Error('无效的电话号码！');
      }

      dispatch(actionSetApiLoading(true));
      const EndpointOfFindOrder = `https://www.snailsmall.com/Order/FindPage?data={"Criterion":{"OrdCode":"${orderCode}"},"PageIndex":0,"PageSize":1}&buyercode=${APP_CONST.MY_BUYER_CODE}`
      const result0 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfFindOrder });
      const orderList = result0.data.Data.DataBody;
      let orderId = 0;
      if (orderList && orderList[0]) {
        orderId = orderList[0].OrdId;
      }
      else {
        throw new Error('无效的订单号！');
      }

      const EndpointOfOrderSummary = `https://www.snailsmall.com/Order/GetById?data={"OrdId":"${orderId}"}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
      const result1 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfOrderSummary });
      const orderSummary = result1.data.Data;
      if (orderSummary.OrdBuyerCode !== APP_CONST.MY_BUYER_CODE.toString()) {
        throw new Error('查询错误！');
      }


      if (mustProvideReceiverPhone
        && orderSummary.OrdReceiverMobile !== receiverPhoneTextFieldValue
        && !orderSummary.OrdRemark.includes(receiverPhoneTextFieldValue)
      ) {
        throw new Error('收件人电话不匹配！');
      }

      const EndpointOfLogisticSummary = `https://www.snailsmall.com/Order/FindLogistics1?data={"OrdCode":"${orderSummary.OrdCode}"}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
      const result2 = await axios.post('/api/proxy', { method: 'POST', url: EndpointOfLogisticSummary });
      const logisticSummary = result2.data.Data;
      dispatch(actionSetApiLoading(false));
      setOrderDetails({ orderSummary, logisticSummary });
    }
    catch (err) {
      console.log(err);
      dispatch(actionSetApiLoading(false));
      dispatch(actionSetSnackbar({
        visible: true,
        message: err.message,
        autoHideDuration: 5000,
      }));
      setOrderDetails(null);
    }
  };

  const renderOrderDetails = () => {
    return (<>
      <FolderCard
        defaultExpansion={true}
        avatar={<InfoIcon />}
        title={'订单详情'}
      >
        <List component="nav" >
          <ListItem >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={"收件人姓名"}
              secondary={orderDetails.orderSummary.OrdReceiverName}
            />
          </ListItem>

          <ListItem >
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText
              primary={"收件人身份证"}
              secondary={orderDetails.orderSummary.OrdReceiverCardNo}
            />
          </ListItem>

          <ListItem >
            <ListItemIcon>
              <PhoneIphoneIcon />
            </ListItemIcon>
            <ListItemText
              primary={"联系电话"}
              secondary={orderDetails.orderSummary.OrdReceiverMobile}
            />
          </ListItem>
          <ListItem >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary={"收件地址"}
              secondary={orderDetails.orderSummary.OrdReceiverProvince + orderDetails.orderSummary.OrdReceiverCity + orderDetails.orderSummary.OrdReceiverCounty + orderDetails.orderSummary.OrdReceiverAddress}
            />
          </ListItem>

          <ListItem >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={"备注"}
              secondary={orderDetails.orderSummary.OrdRemark}
            />
          </ListItem>
          {showExpressOrderNumber &&
            <ListItem >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary={"物流单号"}
                secondary={`${orderDetails.logisticSummary.SorShowExpressUrl}: ${orderDetails.logisticSummary.SorShowWaybillNo}`}
              />
            </ListItem>
          }
          <ListItem >
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText
              primary={"订单创建时间"}
              secondary={orderDetails.orderSummary.OrdCreateTime}
            />
          </ListItem>
        </List>
      </FolderCard>

      <FolderCard avatar={<ViewListIcon />} title={'商品列表'}>
        <List component="nav">
          {orderDetails.orderSummary.EcmOrderGoodsInfos.map((item, i) => (
            <ListItem key={i}>
              <ListItemAvatar>
                <Avatar src={item.OgoGoodsImageUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={item.OgoGoodsTitle}
                secondary={`数量：${item.OgoNumber}`}
              />
            </ListItem>
          ))}
        </List>
      </FolderCard>

      <FolderCard avatar={<LocalShippingIcon />} title={'物流信息'}>
        <List component="nav">
          {orderDetails.logisticSummary.NodeInfos.map((node, i) => (
            <ListItem key={i}>
              <ListItemIcon >
                {i === 0 ? <AccessTimeIcon /> : <CheckCircleIcon />}
              </ListItemIcon>
              <ListItemText
                primary={node.context}
                secondary={node.time}
              />
            </ListItem>
          ))}
        </List>
      </FolderCard>
    </>);
  };

  return (<>
    <Box my={1}>
      <TextField
        id="standard-basic"
        fullWidth={true}
        label="订单号"
        value={orderCodeTextFieldValue}
        variant="outlined"
        onChange={handleOrderCodeTextFieldOnChange}
      />
    </Box>
    {mustProvideReceiverPhone && <Box my={1}>
      <TextField
        id="standard-basic"
        fullWidth={true}
        label="收件人电话"
        value={receiverPhoneTextFieldValue}
        variant="outlined"
        onChange={handleReceiverPhoneTextFieldOnChange}
      />
    </Box>}
    <Button
      variant="contained"
      fullWidth={true}
      color="primary"
      startIcon={<SearchIcon />}
      onClick={() => { fetchOrderDetails(orderCodeTextFieldValue) }}
    >
      查询订单
    </Button>
    {orderDetails !== null && renderOrderDetails()}
  </>);

};
