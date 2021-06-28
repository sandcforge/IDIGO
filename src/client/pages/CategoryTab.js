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
import { showLoadMoreButtonOnTab } from '../utils.js';

export const CategoryTab = () => {
  const dispatch = useDispatch();

  const [subTabValue, setSubTabValue] = React.useState(0);
  const productCategory = useSelector(state => state.data.productCategory);
  const categoryProducts = useSelector(state => state.data.categoryProducts);
  const dataLoadingStatus = useSelector(state => state.ui.dataLoadingStatus);
  const collectionGodIdSet = useSelector(state => new Set(state.data.collectionProducts.map(item => item.GodId)));

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
        whitelistSet={collectionGodIdSet}
        listData={categoryProducts}
        showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.CATEGORY_TAB_INDEX)}
        keyName='GodId'
        onLoadData={() => dispatch(actionGetCategoryProducts(subTabValue))}
      />
  </>);
}