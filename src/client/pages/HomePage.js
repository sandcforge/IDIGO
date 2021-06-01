import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { TabPanel } from '../components/TabPanel.js';
import { UI_CONST } from '../constants.js';
import {
  actionSetTabIndex,
} from '../redux/actions.js';
import { CategoryTab } from './CategoryTab.js';
import { CollectionTab } from './CollectionTab.js';
import { OrderTab } from './OrderTab.js';
import { SearchTab } from './SearchTab.js';


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

  const handleRootTabChange = (event, newValue) => {
    dispatch(actionSetTabIndex(newValue));
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
          <Tab label="分类" {...a11yProps(UI_CONST.CATEGORY_TAB_INDEX)} />
          <Tab label="搜索" {...a11yProps(UI_CONST.SEARCH_TAB_INDEX)} />
          <Tab label="订单" {...a11yProps(UI_CONST.ORDER_TAB_INDEX)} />
        </Tabs>
      </AppBar>
      <TabPanel value={rootTabValue} index={UI_CONST.COLLECTION_TAB_INDEX}>
        <CollectionTab/>
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.CATEGORY_TAB_INDEX}>
        <CategoryTab/>
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.SEARCH_TAB_INDEX}>
        <SearchTab/>
      </TabPanel>
      <TabPanel value={rootTabValue} index={UI_CONST.ORDER_TAB_INDEX} >
        <OrderTab/>
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
