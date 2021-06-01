import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import { ListView } from '../components/ListView.js';
import { ItemCard } from '../components/ItemCard.js';
import { UI_CONST } from '../constants.js';
import {
  actionResetTab,
  actionGetSearchResults,
} from '../redux/actions.js';


export const SearchTab = () => {
  const dispatch = useDispatch();

  const [searchTextFieldValue, setSearchTextFieldValue] = useState('');

  const searchResults = useSelector(state => state.data.searchResults);
  const dataLoadingStatus = useSelector(state => state.ui.dataLoadingStatus);


  const handleSearchTextFieldOnChange = (event) => {
    setSearchTextFieldValue(event.target.value);
  };

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

  const onClickSearchButton = async () => {
    dispatch(actionResetTab(UI_CONST.SEARCH_TAB_INDEX));
    dispatch(actionGetSearchResults(searchTextFieldValue));
  };

  return (<>
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
      onClick={onClickSearchButton}
    >
      搜索商品
        </Button>
    <ListView
      listData={searchResults}
      showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.SEARCH_TAB_INDEX)}
      content={ItemCard}
      keyName='GodId'
      onLoadData={() => dispatch(actionGetSearchResults(searchTextFieldValue))}
    />
  </>);
};
