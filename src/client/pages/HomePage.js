import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from "@material-ui/core/Container";
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
import PlaceIcon from '@material-ui/icons/Place';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import EventIcon from '@material-ui/icons/Event';
import SearchIcon from '@material-ui/icons/Search';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ViewListIcon from '@material-ui/icons/ViewList';

import {ItemCard} from '../components/ItemCard.js';
import {FolderCard} from '../components/FolderCard.js';
import {TabPanel} from '../components/TabPanel.js';
import cover from '../../../public/cover.jpg';
import { APP_CONST, UI_CONST } from '../constants.js';
import { actionSetTabIndex, actionGetProductCategory } from '../redux/actions.js';


export const HomePage = () => {
  const dispatch = useDispatch();
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    cover: {
      width: '100%',
      marginTop: 8,
      marginBottom: 8,
    }
  }));
  const classes = useStyles();

  const rootTabValue = useSelector(state => state.ui.homePageTabIndex);
  const productCategory = useSelector(state => state.data.productCategory);
  const [subTabValue, setSubTabValueValue] = React.useState(0);
  const [tabPageStatus, setTabPageStatus] = React.useState(UI_CONST.DEFAULT_TAB_PAGE_STATUS);
  const [listData, setListData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderIdTextFieldValue, setOrderIdTextFieldValue] = useState('');
  const [searchTextFieldValue, setSearchTextFieldValue] = useState('');

  const handleSubTabChange = (event, newValue) => {
    clearListData();
    setSubTabValueValue(newValue);
  };

  const handleRootTabChange = (event, newValue) => {
    clearListData();
    dispatch(actionSetTabIndex(newValue));
  };

  const handleSearchTextFieldOnChange = (event) => {
    clearListData();
    setSearchTextFieldValue(event.target.value);
  };

  const handleOrderIdTextFieldOnChange = (event) => {
    setOrderIdTextFieldValue(event.target.value);
  };

  const clearListData = () => {
    setListData([]);
    setTabPageStatus(UI_CONST.DEFAULT_TAB_PAGE_STATUS);
  };

  const loadListData = (newData) => {
    if (newData.length === 0) {
      setTabPageStatus(prevState => ({
        ...prevState,
        hasMore: false,
      }));
    }
    else {
      setListData(listData.concat(newData));
      setTabPageStatus(prevState => ({
        ...prevState,
        index: tabPageStatus.index+1,
      }));
    }
  };

  /**
   *
   * @param {*} keyword : search keyword, only return goods info from Health products.
   */
  const fetchSearchResults = async (keyword) => {
    const EndpointOfSearch = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"SearchKeys":"${keyword}","GodPurchaseSource":"costco"},"PageIndex":${tabPageStatus.index},"PageSize":${APP_CONST.PAGE_SIZE}}`;
    const result = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfSearch});
    const filteredList = result.data.Data.DataBody.filter( good => APP_CONST.GOODS_WHITE_LIST.includes(good.GodCode) );
    loadListData(filteredList);
};

  const fetchData = async () => {
    const buildFetchUrl = (tabIndex, subTabIndex, pageIndex) => {
      if (tabIndex === UI_CONST.COLLECTION_TAB_INDEX) {
        const EndpointOfNewProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodPurchaseSource":"costco"},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
        // const EndpointOfNewProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodIsNew":true},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
        return EndpointOfNewProducts;
      }
      else if (tabIndex === UI_CONST.CATEGORY_TAB_INDEX) {
        const EndpointOfCategroyProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodCategoryCode":"${productCategory[subTabIndex].MgcCode}"},"PageIndex":${pageIndex},"PageSize":${APP_CONST.PAGE_SIZE}}`;
        return EndpointOfCategroyProducts;
      }
      return '';
    };
    if (rootTabValue === UI_CONST.COLLECTION_TAB_INDEX || rootTabValue === UI_CONST.CATEGORY_TAB_INDEX) {
      const result = await axios.post('/api/proxy',{method: 'GET', url: buildFetchUrl(rootTabValue, subTabValue, tabPageStatus.index)});
      const filteredList = result.data.Data.DataBody.filter( good => APP_CONST.GOODS_WHITE_LIST.includes(good.GodCode) );
      loadListData(filteredList);
    }
  };


  const fetchOrderDetails = async (orderId) => {
    try {
      const EndpointOfOrderSummary = `https://www.snailsmall.com/Order/GetById?data={"OrdId":"${orderId}"}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
      const result1 = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfOrderSummary});
      const orderSummary = result1.data.Data;
      if (orderSummary.OrdBuyerCode !== APP_CONST.MY_BUYER_CODE.toString()) {
        throw new Error('The buyer does not match!');
      }

      const EndpointOfLogisticSummary = `https://www.snailsmall.com/Order/FindLogistics1?data={"OrdCode":"${orderSummary.OrdCode}"}&buyercode=${APP_CONST.MY_BUYER_CODE}`;
      const result2 = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfLogisticSummary});
      const logisticSummary = result2.data.Data;
      setOrderDetails({status: APP_CONST.DATA_STATUS_OK, orderSummary, logisticSummary});
    }
    catch (err) {
      console.log(err);
      setOrderDetails({status: APP_CONST.DATA_STATUS_ERROR, errMsg: '查询错误！'});
    }
  };


  useEffect(() => {
    fetchData();
  }, [rootTabValue, subTabValue]);
  useEffect(() => {
   dispatch(actionGetProductCategory());
  }, []);

  const renderListView = () => {
    let handleLoadingMoreButtonOnClick = null;
    if (rootTabValue === UI_CONST.SEARCH_TAB_INDEX) {
      handleLoadingMoreButtonOnClick = async() => fetchSearchResults(searchTextFieldValue);
    }
    else {
      handleLoadingMoreButtonOnClick = async() => fetchData();
    }
    return (<>
      {listData.map((item) => <ItemCard key={item.GodId} details={item}/>)}
      {tabPageStatus.hasMore &&
        <Container>
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={handleLoadingMoreButtonOnClick}
          >
            加载更多1
          </Button>
          {/*Add a padding to avoid the mobile phone gesture area at the bottom.*/}
          <Typography
            component='span'
            style={{ height: "12vh" }}
          />
        </Container>
      }
      </>
    );
  };

  const renderOrderDetails = () => {
    if (orderDetails === null) {
      return null;
    }
    if (orderDetails && orderDetails.status === APP_CONST.DATA_STATUS_OK) {
      return (<>
        <FolderCard avatar={<InfoIcon/>} title={'订单详情'}>
        <List component="nav" >
          <ListItem >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={"收件人"}
              secondary={orderDetails.orderSummary.OrdReceiverName}
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
              <PlaceIcon />
            </ListItemIcon>
            <ListItemText
              primary={"收件地址"}
              secondary={orderDetails.orderSummary.OrdReceiverProvince+orderDetails.orderSummary.OrdReceiverCity+orderDetails.orderSummary.OrdReceiverCounty+orderDetails.orderSummary.OrdReceiverAddress}
            />
          </ListItem>
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

        <FolderCard avatar={<ViewListIcon/>} title={'商品列表'}>
          <List component="nav">
            {orderDetails.orderSummary.EcmOrderGoodsInfos.map( (item, i) => (
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

        <FolderCard avatar={<LocalShippingIcon/>} title={'物流信息'}>
        <List component="nav">
          {orderDetails.logisticSummary.NodeInfos.map( (node, i) => (
              <ListItem >
                <ListItemIcon >
                  { i=== 0 ?  <AccessTimeIcon /> : <CheckCircleIcon /> }
                </ListItemIcon>
                <ListItemText
                  key={i}
                  primary={node.context}
                  secondary={node.time}
                />
              </ListItem>
          ))}
        </List>
        </FolderCard>
      </>);
    }
    else {
      return (<div>{orderDetails.errMsg}</div>);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={rootTabValue}
          onChange={handleRootTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="精选" {...a11yProps(UI_CONST.COLLECTION_TAB_INDEX)} />
          {/* <Tab label="分类" {...a11yProps(UI_CONST.CATEGORY_TAB_INDEX)} /> */}
          <Tab label="搜索" {...a11yProps(UI_CONST.SEARCH_TAB_INDEX)} />
          <Tab label="订单" {...a11yProps(UI_CONST.ORDER_TAB_INDEX)} />
        </Tabs>
      </AppBar>
      <TabPanel value={rootTabValue} index={UI_CONST.COLLECTION_TAB_INDEX}>
        <img className={classes.cover} src={cover}/>
        {renderListView()}
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.CATEGORY_TAB_INDEX}>
        <AppBar position="static" color="default">
          <Tabs
            value={subTabValue}
            onChange={handleSubTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
            aria-label="scrollable auto tabs example"
          >
            {productCategory.map(( category, idx ) => <Tab key={category.MgcId} label={category.MgcName} {...a11yProps(idx)} />)}
          </Tabs>
        </AppBar>

        <TabPanel value={subTabValue} index={subTabValue}>
          {renderListView()}
        </TabPanel>

      </TabPanel>

      <TabPanel value={rootTabValue} index={UI_CONST.SEARCH_TAB_INDEX}>
      <Box my={1}>
          <TextField
            id="standard-basic"
            fullWidth={true}
            label="商品名称"
            value={searchTextFieldValue}
            variant="outlined"
            onChange={handleSearchTextFieldOnChange}
          />
        </Box>
        <Button
          variant="contained"
          fullWidth={true}
          color="primary"
          startIcon={<SearchIcon />}
          onClick={()=>{fetchSearchResults(searchTextFieldValue)}}
        >
          搜索商品
        </Button>
        {renderListView()}
      </TabPanel>


      <TabPanel value={rootTabValue} index={UI_CONST.ORDER_TAB_INDEX} >
        <Box my={1}>
          <TextField
            id="standard-basic"
            fullWidth={true}
            label="订单号"
            value={orderIdTextFieldValue}
            variant="outlined"
            onChange={handleOrderIdTextFieldOnChange}
          />
        </Box>
        <Button
          variant="contained"
          fullWidth={true}
          color="primary"
          startIcon={<SearchIcon />}
          onClick={()=>{fetchOrderDetails(orderIdTextFieldValue)}}
        >
          查询订单
        </Button>
        {renderOrderDetails()}
      </TabPanel>
    </div>
  );

};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
