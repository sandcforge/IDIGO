import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { ItemCard } from '../components/ItemCard.js';
import { ListView } from '../components/ListView.js';
import { TabPanel } from '../components/TabPanel.js';
import cover from '../../../public/cover.jpg';
import { UI_CONST } from '../constants.js';
import {
  actionSetTabIndex,
  actionGetCollectionProducts,
} from '../redux/actions.js';
import { CategoryTab } from './CategoryTab.js';
import { SearchTab } from './SearchTab.js';
import { OrderTab } from './OrderTab.js';


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
  const collectionProducts = useSelector(state => state.data.collectionProducts);
  const dataLoadingStatus = useSelector(state => state.ui.dataLoadingStatus);


  const handleRootTabChange = (event, newValue) => {
    dispatch(actionSetTabIndex(newValue));
  };

  useEffect(() => {
    dispatch(actionGetCollectionProducts());
  }, []);

  const showLoadMoreButtonOnTab = (tabIndex) => {
    let ret = false;
    switch (tabIndex) {
      case UI_CONST.COLLECTION_TAB_INDEX:
        ret = dataLoadingStatus.collectionTab.currentPageIndex !== 0 && dataLoadingStatus.collectionTab.hasMore === true;
        break;
      case UI_CONST.SEARCH_TAB_INDEX:
        ret = dataLoadingStatus.searchTab.currentPageIndex !== 0 && dataLoadingStatus.searchTab.hasMore === true;
        break;
    }
    return ret;
  }


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
        <img className={classes.cover} src={cover} />
        <ListView
          listData={collectionProducts}
          showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.COLLECTION_TAB_INDEX)}
          content={ItemCard}
          keyName='GodId'
          onLoadData={() => dispatch(actionGetCollectionProducts())}
        />
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
