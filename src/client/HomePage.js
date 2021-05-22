import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ItemCard} from './ItemCard.js';
import {FolderCard} from './FolderCard.js';
import PropTypes from 'prop-types';
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
import cover from '../../public/cover.jpg';
const corsProxy = 'https://api.codetabs.com/v1/proxy/?quest=';
const EndpointOfProductCategory = `https://www.snailsmall.com/GoodsCategory/FindBigCategory`;
const CONST_PAGE_SIZE = 100;
/**
 * The tab index hasb to be 0, 1, 2, 3...
 * We do not show CONST_CATEGORY_TAB_INDEX, so set this one to be -1.
 */
const CONST_HOME_PAGE_TAB_INDEX = 0;
const CONST_CATEGORY_TAB_INDEX = -1;
const CONST_SEARCH_TAB_INDEX = 1;
const CONST_ORDER_TAB_INDEX = 2;
const defaultTabPageStatus = {index: 0, hasMore: true};
const CONST_MY_BUYER_CODE = 68995;
const CONST_DATA_STATUS_OK = 0;
const CONST_DATA_STATUS_ERROR = -1;
const CONST_GOODS_WHITE_LIST = [
  'fbe1b7da-cd29-4707-a069-eff19fdc5cbe',
  '77317203-ba3c-4d43-a99e-fc6159156439',
  '6f07233e-a9d4-4217-91b1-2f476ff0cf7a',
  'bd087f9a-ffec-4f74-a08d-2d96443405f7',
  '2b5563f5-22b7-4b9b-b224-7e6e187a1ff3',
  '1ca352f4-8487-41c7-8727-ac94615b575f',
  '0008d392-13a2-441a-9ecb-2c3e5fdf172c',
  'c5a698c4-57cd-40d8-bf17-b266ff843e07',
  '9939dca7-7213-4979-8ada-9962f6a1c5f5',
  'c7c8fb92-dfda-4be0-823b-32d7f31f615f',
  'c4d6bff7-71df-4530-85e5-cca7aba8dade',
  '8cf772d6-9706-44c4-96bd-a0d8074b3fa7',
  '7b17cc3b-2dd9-4bce-bf38-c72cbac23b76',
  '92975a37-32f8-4357-a05d-19501a6e0afc',
  '01a5129d-8c63-4b08-9548-83278b28e3a1',
  '1c6294bc-2348-47f9-8dc7-0cb527b2ccfd',
  '462c814c-6f5c-4ed0-a9e4-7f99ba8e59de',
  'e2133613-d0e3-43fb-a235-0e1c57a9fcf4',
  '813fd994-8ca3-4bc6-a971-ae61e2a6caf8',
  '0d5f28fe-ef31-42eb-9e8e-91dbfba1db9c',
  'ea9bb92d-2c74-4c35-8eae-372bdf7ed733',
  'cb17a31f-15e6-43db-9a57-626715cafe77',
  '66c17363-d8d2-45d0-b99e-8d17bd135558',
  'e61a299e-60fc-41d5-8c4f-473730b38192',
  'cea03a80-5a2e-41d0-9dc9-e0352b143d4c',
  '4d9f151d-59fe-415c-a630-4d6d81aaff20',
  '5fc32061-1e12-4f06-a586-e6561db18982',
  '9fce9b95-e444-463d-8708-04fcaef9ebdd',
  '116f0902-2993-47a2-85b9-d320eae00904',
  '3614e700-327b-4da7-9447-c6908ad1e33c',
  '14e799bf-c1b7-4bf9-9a7e-402972126851',
  '04628418-48f0-4ab6-942c-aaa92a0ac363',
  '9435afac-0c32-4871-bd4a-45384b852048',
  'e281fe81-0af8-432a-a39e-cbb7cd6b39ea',
  '38266205-b9b7-4c0b-94d2-ad1f7181be30',
  '6b89806c-0d0a-45df-a6fa-e55cafe0624c',
  '6543aedb-b9bc-4343-ad3f-12304698426e',
  '382da0eb-7f56-413d-beba-7f1ffbdb98a3',
  'd4b72c01-c4c1-4fe2-87d5-72e2d4b0a42a',
  'f42a01ea-0445-4e2c-bcb1-b5eb9985391d',
  'fb9d06a2-e769-4701-99a5-1a47e0b09306',
  'd9a31cb4-cff4-4660-a024-f35ffcb22355',
  '8724ae03-921b-46db-8461-1082e21c15b9',
  '6c7b2967-0080-4e20-befe-48550ac9bff1',
  '21f2895d-bfe9-471c-951c-f31eae1d1480',
  'da7ed582-c4aa-4ee8-82c4-b4e64d0ab89b',
  '238964f1-c1e1-4526-86cd-a30feef287ea',
  'cb3ccac1-d633-46eb-89dd-de4e52f9bd03',
  'df2278fa-542c-43ff-8772-38cea4609abb',
  'b4870239-5048-44ef-8bec-04a7f39b60b0',
  '1bafbda7-bdf6-4895-a19a-9b92b76ae3a8',
  'ba0817d1-cd94-4bcf-8f61-7e188f0b87b0',
  '2348494b-7fba-4a23-8ebd-df322cc55063',
  '53395f00-f4e7-45bc-a7d6-fab40cc43f53',
  '98af0610-3952-4a16-bfcd-e25ab4538653',
  'a2b47650-a5b1-4ffa-916c-da9cd41cd65f',
  '9a009bb9-3dbb-4e7d-a9c1-6ebeaa0d1c91',
  '5af7e930-bacf-44c6-aa7f-64958dd8737f',
  '9b112545-cf9b-4899-b58b-37e78e4fee8c',
  '10c514cf-e2c5-4f65-a25c-71558c565e4c',
  '02412080-f2c2-44b1-bf7c-17c9a43e137d',
  '282d1530-3168-4283-856a-de1ebb2f2da2',
  '311faeec-04bc-407f-bdff-2194fb8ed754',
  'f3c88d71-a5b6-4963-862f-0682357e4827',
  '06869438-7d66-4a93-9bf1-33324dfc32f4',
  'ccb8b3eb-5c30-40cc-af86-8e05f2682eba',
  '37541199-fb95-492c-8b72-80fadace74c7',
  'd1cce782-77f4-40f4-9c2b-1411adf2c4e7',
  '11361235-3271-44ce-8e81-a54db3058d45',
  '5c1812b3-9a99-47de-9f0e-fced3c48ce49',
  '47108034-7495-4134-a1a3-3c2eebbf941a',
  'd474cd58-8d96-4b08-ba73-0453f5449f1b',
  'ab5fd891-b7f6-41c3-bdcc-68888632e223',
  'e4875043-f569-4c81-8902-d1de2a14c33f',
  '1408794a-8af9-4030-ab5b-8faf11970fe8',
  'f8e1e3ef-8b85-4cd2-8b4b-c70c576c505c',
  '99cf7e1f-2eed-4079-8bfc-b37fd5ade1f1',
  '197ba956-9fb6-4f61-aef3-79b50d9e00e5',
  'a6bfd2af-1e5b-47e4-9777-9eb6eda82d27',
  '77fc4a42-ee89-4e16-afd4-bc6992f9b7e3',
  '6543ccc0-eea0-43ea-830b-7fbf8263a8c7',
  'ed82cc0e-b12a-4511-a049-3eee88a2bd55',
  '8b479622-0683-4e58-923c-dc831ec7bbd2',
  'a3175980-94d0-44d7-9a1b-0d8732873b2d',
  'c9a21fec-9fb3-421f-ba76-1cc59b726088',
  '624595ad-d16f-414b-8473-9434219165db',
  '9a97e021-d614-46ee-b9b9-cffc002223dd',
  'c8265334-f821-487f-a567-653d12a6f1df',
  '2ec5c773-c457-47a6-9410-d8ec5d9bb428',
  '3c3fee03-11dd-49f4-8fd0-07cebff9ddeb',
  '5ea88478-a008-470b-8273-cdeda704ad0d',
  '263aa839-58d2-4a46-9a5e-a01ff8a3d9cc',
  '3d6cdc85-6722-43a9-8596-62ea74a357c0',
  '6df8b118-08a8-412a-be35-69282c1916ab',
  '2bbbc4ca-bbc3-449f-aa8d-59ed074ee20c',
  '883996f6-4f31-4d1b-a555-f4f70cd259c0',
  '82622565-7630-4ed3-ad1b-fdffa9830356',
  '447712fa-732f-4219-afea-482a435bf17e',
  '9898e81a-7954-4f08-8ebe-a2e402e4bbea',
  '6d6d116a-ea98-4505-b770-aa2d5a560406',
  '94b78535-4431-49c1-890b-07065048f8c3',
  'b894ee48-d2ee-4b05-a7d7-b8205f6fee08',
  '36c7e120-0264-4192-a6dd-920b12655570',
  'ddd3cf6c-3946-4ea0-9c4b-82300008b6a0',
  '52eff849-9a19-4e34-bd3e-519c232ae0ce',
  '304b1fab-d14b-4ace-a177-d80256043e2c',
  '938f0ae1-3938-43d7-9847-a4b68ed04e6a',
  '296de4ad-9095-417d-bc97-a0784f5751e5',
  '9fe3303e-fbb3-4baf-ab4c-1e2b4bc72615',
  '479c2a2b-380f-47ca-a900-62a1914b06e8',
  'a24bdb2d-5b33-41ef-83c2-6c976395ed44',
  '16df4a87-96f7-497a-aac2-0369e1fda74e',
  '584b2dac-19a1-44b8-82e9-40f9c55f7fe9',
  '8e81a895-c85b-45c4-8860-90c6a09a8c9d',
  '23000ebd-f847-4fdb-9f50-2e11c8cfa842',
  '8112d0f6-6a44-44e0-b5c1-20a6dd72456f',
  '8f35fe4f-8c1e-42a0-a2b2-5e01125ab7e3',
  '269c24c5-ed3c-47e6-a9ef-8e9e67143549',
  'a7b75608-4781-4240-b313-e49de0437574',
  '62ca6849-7026-4586-b395-2a6958b5086c',
  '3adf1de4-b062-4e05-b0c9-c41fd829f165',
  '8c268002-4b03-4659-a0d4-bf1d77e4b9d6',
  '54fe0f8c-048e-4af2-a413-0cc48172c769',
  'de35258d-edc3-4a85-b628-934b689b155d',
  '576b96a3-4795-4b22-985c-351215266edd',
  'c9597cda-ee2e-487d-bbf4-cf0395bb5ee4',
  '1df61c2e-6ae2-4b2b-9ec3-74040a38b522',
  'cb5a5123-3c33-43ec-86f6-e8682321e7d4',
  '0009d464-b1e7-4398-b278-6e24c6f42831',
  'fe189a82-6101-4157-8ec8-d6c511baed0f',
  'e228f176-9a3d-4257-b001-47a314519b6f',
  '727e490c-ba9c-418f-9ad7-21bc1925da0c',
  'd1515eb2-1569-4bd6-8156-6ea5b066a616',
  '17245b6a-ff1c-464c-8124-7c887b3ac852',
  '1127694e-4383-4567-a554-58ecc3dc469b',
  '28efaf66-903d-4945-900d-23803384fff2',
  '0687cb3b-920b-4a0f-a8b7-1e4c83b15770',
  '940eca78-8f70-4934-aefd-69d5fb417f6f',
  '37db7471-4936-4b92-b20c-5343aff0f6cc',
  '7caf6371-1b99-474c-bb05-91bb5445678e',
  '2814c86b-258e-4c25-a48c-94540eead891',
  '673f19ed-cdd3-46fe-a7be-2ce2006901f7',
  '1e98c17f-ae3a-46f2-97bf-b74b39fe34a8',
  '882fb817-ec1d-4e5b-9bc7-72ac3512dff8',
  'dffd78ac-7f83-4ac0-9755-ad18b1e3390f',
  'abef50cc-9f48-49c8-82d8-624f72acc97f',
  '2ea2725c-a59f-40a9-ac34-03a9699a22b8',
  '8ee34bb6-347a-43ee-8d64-30a407bbbb55',
  'f3ec367c-1c37-4bd2-bf1c-668561d0c6f2',
  'daa59cb1-362b-4b28-843e-f401a1326740',
  '928d66db-516a-4277-8626-34ff65cdf4ee',
  '34df32d7-bd49-4403-b4cd-4bc7fef52322',
  '2a0e2d33-9955-499b-ac30-2f5241e7b865',
  '30e8f4b5-5645-4ae6-9723-9c74124be17c',
  'eb80924e-43a9-473b-bf6b-5b268c43f7af',
  '93ba99bd-b90e-43af-a406-1ab1d5d633ec',
  '66deea3b-1f64-4e8c-8902-44ab4ce5ead1',
  '20d3a57c-2fd7-4c7b-bf69-5a9bd0a394a0',
  '69d86064-f267-4a1f-9523-2ad562591755',
  '0e79d1e2-cc55-4d12-8ed8-5f8c17796563',
  'e14b70cf-b881-4b73-bfc6-b992d285fdbc',
  '5dc034f0-3ddb-4b96-a300-5fc95395fc44',
  '26ecdd92-b23d-4679-bb2d-95da04fc8155',
  'f77deb62-5e74-4ec0-b3d5-037b837286ad',
  '536e65ac-b958-4617-955a-cfa8d46f1c21',
  '1e82d3e3-e32f-4033-b64d-ca8cd0bca2c3',
  '44ea7403-9eaa-4d71-aa56-d64d105994e4',
  'ec1f23ad-f7b1-4354-b7f0-5919406897d9',
  'af4ad44d-38bf-48df-84ea-00ebea019569',
  'd78e44e4-183b-4557-8bbc-0ad30dbed600',
  '77f206dd-76d5-4890-9c48-bebcb336be40',
  '3748df15-f013-49b4-8ecf-b60845e843f4',
  '52a85ebc-d8f2-4faf-8499-50f8a468c6e7',
  '30b7e994-9705-4ad4-b366-8b095336a3bc',
  '2b361d3f-4fd3-42f1-ade0-9a59b9deedd6',
  '7f009195-fb74-45fc-ae60-92aff870a1b7',
];

export const HomePage = () => {
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
  const [rootTabValue, setRootTabValueValue] = React.useState(0);
  const [subTabValue, setSubTabValueValue] = React.useState(0);
  const [tabPageStatus, setTabPageStatus] = React.useState(defaultTabPageStatus);
  const [listData, setListData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [productCategory, setProductCategory] = useState([]);
  const [orderIdTextFieldValue, setOrderIdTextFieldValue] = useState('');
  const [searchTextFieldValue, setSearchTextFieldValue] = useState('');

  const handleSubTabChange = (event, newValue) => {
    clearListData();
    setSubTabValueValue(newValue);
  };

  const handleRootTabChange = (event, newValue) => {
    clearListData();
    setRootTabValueValue(newValue);
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
    setTabPageStatus(defaultTabPageStatus);
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
    const EndpointOfSearch = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"SearchKeys":"${keyword}","GodPurchaseSource":"costco"},"PageIndex":${tabPageStatus.index},"PageSize":${CONST_PAGE_SIZE}}`;
    const result = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfSearch});
    const filteredList = result.data.Data.DataBody.filter( good => CONST_GOODS_WHITE_LIST.includes(good.GodCode) );
    loadListData(filteredList);
};

  const fetchData = async () => {
    const buildFetchUrl = (tabIndex, subTabIndex, pageIndex) => {
      if (tabIndex === CONST_HOME_PAGE_TAB_INDEX) {
        const EndpointOfNewProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodPurchaseSource":"costco"},"PageIndex":${pageIndex},"PageSize":${CONST_PAGE_SIZE}}`;
        // const EndpointOfNewProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodIsNew":true},"PageIndex":${pageIndex},"PageSize":${CONST_PAGE_SIZE}}`;
        return EndpointOfNewProducts;
      }
      else if (tabIndex === CONST_CATEGORY_TAB_INDEX) {
        const EndpointOfCategroyProducts = `https://www.snailsmall.com/Goods/FindPage?data={"Criterion":{"GodCategoryCode":"${productCategory[subTabIndex].MgcCode}"},"PageIndex":${pageIndex},"PageSize":${CONST_PAGE_SIZE}}`;
        return EndpointOfCategroyProducts;
      }
      return '';
    };
    if (rootTabValue === CONST_HOME_PAGE_TAB_INDEX || rootTabValue === CONST_CATEGORY_TAB_INDEX) {
      const result = await axios.post('/api/proxy',{method: 'GET', url: buildFetchUrl(rootTabValue, subTabValue, tabPageStatus.index)});
      const filteredList = result.data.Data.DataBody.filter( good => CONST_GOODS_WHITE_LIST.includes(good.GodCode) );
      loadListData(filteredList);
    }
  };

  const fetchProductCategory = async () => {
    const result = await axios.post('/api/proxy',{method: 'GET', url: EndpointOfProductCategory});
    setProductCategory(result.data.Data);
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const EndpointOfOrderSummary = `https://www.snailsmall.com/Order/GetById?data={"OrdId":"${orderId}"}&buyercode=${CONST_MY_BUYER_CODE}`;
      const result1 = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfOrderSummary});
      const orderSummary = result1.data.Data;
      if (orderSummary.OrdBuyerCode !== CONST_MY_BUYER_CODE.toString()) {
        throw new Error('The buyer does not match!');
      }

      const EndpointOfLogisticSummary = `https://www.snailsmall.com/Order/FindLogistics1?data={"OrdCode":"${orderSummary.OrdCode}"}&buyercode=${CONST_MY_BUYER_CODE}`;
      const result2 = await axios.post('/api/proxy',{method: 'POST', url: EndpointOfLogisticSummary});
      const logisticSummary = result2.data.Data;
      setOrderDetails({status: CONST_DATA_STATUS_OK, orderSummary, logisticSummary});
    }
    catch (err) {
      console.log(err);
      setOrderDetails({status: CONST_DATA_STATUS_ERROR, errMsg: '查询错误！'});
    }
  };


  useEffect(() => {
    fetchData();
  }, [rootTabValue, subTabValue]);
  useEffect(() => {
    fetchProductCategory();
  }, []);

  const renderListView = () => {
    let handleLoadingMoreButtonOnClick = null;
    if (rootTabValue === CONST_SEARCH_TAB_INDEX) {
      handleLoadingMoreButtonOnClick = async() => fetchSearchResults(searchTextFieldValue);
    }
    else {
      handleLoadingMoreButtonOnClick = async() => fetchData();
    }
    return (<>
      {listData.map((item) => <ItemCard key={item.GodId} details={item}/>)}
      {tabPageStatus.hasMore &&
        <Container maxWidth='98%' >
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            onClick={handleLoadingMoreButtonOnClick}
          >
            加载更多
          </Button>
          {/*Add a padding to avoid the mobile phone gesture area at the bottom.*/}
          <Typography
            component="div"
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
    if (orderDetails && orderDetails.status === CONST_DATA_STATUS_OK) {
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
          <Tab label="首页" {...a11yProps(CONST_HOME_PAGE_TAB_INDEX)} />
          {/* <Tab label="分类" {...a11yProps(CONST_CATEGORY_TAB_INDEX)} /> */}
          <Tab label="搜索" {...a11yProps(CONST_SEARCH_TAB_INDEX)} />
          <Tab label="订单" {...a11yProps(CONST_ORDER_TAB_INDEX)} />
        </Tabs>
      </AppBar>
      <TabPanel value={rootTabValue} index={CONST_HOME_PAGE_TAB_INDEX}>
        <img className={classes.cover} src={cover}/>
        {renderListView()}
      </TabPanel>
      <TabPanel value={rootTabValue} index={CONST_CATEGORY_TAB_INDEX}>
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

      <TabPanel value={rootTabValue} index={CONST_SEARCH_TAB_INDEX}>
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


      <TabPanel value={rootTabValue} index={CONST_ORDER_TAB_INDEX} >
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

const TabPanel = (props) => {
  const { padding = 0, children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box px={padding}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
