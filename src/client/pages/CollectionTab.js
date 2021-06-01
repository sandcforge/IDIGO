import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import cover from '../../../public/cover.jpg';
import { ListView } from '../components/ListView.js';
import { ItemCard } from '../components/ItemCard.js';
import { UI_CONST } from '../constants.js';
import {
  actionGetCollectionProducts,
} from '../redux/actions.js';

export const CollectionTab = () => {
  const useStyles = makeStyles((theme) => ({
    cover: {
      width: '100%',
      marginTop: 8,
      marginBottom: 8,
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();
  const collectionProducts = useSelector(state => state.data.collectionProducts);
  const dataLoadingStatus = useSelector(state => state.ui.dataLoadingStatus);


  useEffect(() => {
    dispatch(actionGetCollectionProducts());
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
    <img className={classes.cover} src={cover} />
    <ListView
      listData={collectionProducts}
      showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.COLLECTION_TAB_INDEX)}
      content={ItemCard}
      keyName='GodId'
      onLoadData={() => dispatch(actionGetCollectionProducts())}
    />
  </>);
};
