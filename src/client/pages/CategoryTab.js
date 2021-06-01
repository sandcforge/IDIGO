import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { ListView } from '../components/ListView.js';
import { UI_CONST } from '../constants.js';
import {
  actionGetCategoryProducts,
  actionGetProductCategory,
  actionResetTab,
} from '../redux/actions.js';

export const CategoryTab = () => {
  const dispatch = useDispatch();

  const [subTabValue, setSubTabValue] = React.useState(0);
  const productCategory = useSelector(state => state.data.productCategory);
  const categoryProducts = useSelector(state => state.data.categoryProducts);
  const dataLoadingStatus = useSelector(state => state.ui.dataLoadingStatus);

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
    dispatch(actionResetTab(UI_CONST.CATEGORY_TAB_INDEX));
    dispatch(actionGetCategoryProducts(newValue));
  };

  useEffect(() => {
    (async () => {
      await dispatch(actionGetProductCategory());
      await dispatch(actionGetCategoryProducts(subTabValue));
    })();
  }, []);

  const showLoadMoreButtonOnTab = (tabIndex) => {
    let ret = false;
    switch (tabIndex) {
      case UI_CONST.COLLECTION_TAB_INDEX:
        ret = dataLoadingStatus.collectionTab.currentPageIndex !== 0 && dataLoadingStatus.collectionTab.hasMore === true;
        break;
      case UI_CONST.CATEGORY_TAB_INDEX:
        ret = dataLoadingStatus.categoryTab.currentPageIndex !== 0 && dataLoadingStatus.categoryTab.hasMore === true;
        break;
      case UI_CONST.SEARCH_TAB_INDEX:
        ret = dataLoadingStatus.searchTab.currentPageIndex !== 0 && dataLoadingStatus.searchTab.hasMore === true;
        break;
    }
    return ret;
  }

  return (<>
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
        {productCategory.map((category) => <Tab key={category.MgcId} label={category.MgcName} />)}
      </Tabs>
    </AppBar>

      <ListView
        listData={categoryProducts}
        showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.CATEGORY_TAB_INDEX)}
        keyName='GodId'
        onLoadData={() => dispatch(actionGetCategoryProducts(subTabValue))}
      />
  </>);
}