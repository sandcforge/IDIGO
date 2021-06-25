import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryParam, NumberParam } from 'use-query-params';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LinearProgress from '@material-ui/core/LinearProgress';

import { TabPanel } from '../components/TabPanel.js';
import { UI_CONST, APP_CONST } from '../constants.js';
import {
  actionSetAccessRole,
  actionSetTabIndex,
  actionSetCustomerService,
} from '../redux/actions.js';
import { CategoryTab } from './CategoryTab.js';
import { CollectionTab } from './CollectionTab.js';
import { OrderTab } from './OrderTab.js';
import { SearchTab } from './SearchTab.js';
import { CartTab } from './CartTab.js';


export const HomePage = () => {
  const dispatch = useDispatch();
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  const classes = useStyles();

  const rootTabValue = useSelector(state => state.ui.homePageTabIndex);
  const isAdmin = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);
  const isLoading = useSelector(state => state.ui.isApiLoading);

  const handleRootTabChange = (event, newValue) => {
    dispatch(actionSetTabIndex(newValue));
  };

  const [role, setRole] = useQueryParam('admin', NumberParam);
  const [customerService, setCustomerService] = useQueryParam('cs', NumberParam);

  useEffect(() => {
    if (role === APP_CONST.ACCESS_ROLE_ADMIN) {
      dispatch(actionSetAccessRole(APP_CONST.ACCESS_ROLE_ADMIN));
    }
    if (customerService === APP_CONST.CUSTOMER_SERVICE_LIUQIAN
      || customerService === APP_CONST.CUSTOMER_SERVICE_HUZI) {
      dispatch(actionSetCustomerService(customerService));
    }
    else {
      dispatch(actionSetCustomerService(APP_CONST.CUSTOMER_SERVICE_NULL));
    }

  }, []);


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={rootTabValue}
          onChange={handleRootTabChange}
          aria-label="simple tabs example"
        >
          <Tab value={UI_CONST.COLLECTION_TAB_INDEX} label="精选" {...a11yProps(UI_CONST.COLLECTION_TAB_INDEX)} />
          {isAdmin && <Tab value={UI_CONST.CATEGORY_TAB_INDEX} label="分类" {...a11yProps(UI_CONST.CATEGORY_TAB_INDEX)} />}
          <Tab value={UI_CONST.SEARCH_TAB_INDEX} label="搜索" {...a11yProps(UI_CONST.SEARCH_TAB_INDEX)} />
          <Tab value={UI_CONST.ORDER_TAB_INDEX} label="订单" {...a11yProps(UI_CONST.ORDER_TAB_INDEX)} />
          {isAdmin && <Tab value={UI_CONST.CART_TAB_INDEX} label="购物车" {...a11yProps(UI_CONST.CART_TAB_INDEX)} />}
        </Tabs>
      </AppBar>
      {isLoading && <LinearProgress />}
      <TabPanel value={rootTabValue} index={UI_CONST.COLLECTION_TAB_INDEX}>
        <CollectionTab />
      </TabPanel>
      {isAdmin &&
        (<TabPanel value={rootTabValue} index={UI_CONST.CATEGORY_TAB_INDEX}>
          <CategoryTab />
        </TabPanel>)}
      <TabPanel value={rootTabValue} index={UI_CONST.SEARCH_TAB_INDEX}>
        <SearchTab />
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.ORDER_TAB_INDEX} >
        <OrderTab />
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.CART_TAB_INDEX} >
        <CartTab />
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
