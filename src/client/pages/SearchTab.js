import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import { ListView } from '../components/ListView.js';
import { UI_CONST } from '../constants.js';
import {
  actionResetTab,
  actionGetSearchResults,
  actionGetPruductMisc,
} from '../redux/actions.js';
import { showLoadMoreButtonOnTab } from '../utils.js';


export const SearchTab = () => {
  const dispatch = useDispatch();

  const [searchTextFieldValue, setSearchTextFieldValue] = useState('');
  const collectionGodIdSet = useSelector(state => new Set(state.data.collectionProducts.map(item => item.GodId)));
  // To merge misc info to product details,
  // Left Join: searchResults * productMisc
  const searchResultswithMisc = useSelector(state => {
    const _searchResults = state.data.searchResults;
    const _productMisc = state.data.productMisc;
    const m = new Map();
    _searchResults.map((x) => { m.set(x.GodId, x); });
    _productMisc.map((x) => {
      if (m.get(x.GodId)) {
        m.set(x.GodId, { ...m.get(x.GodId), _: x });
      }
    });
    return Array.from(m.values());
  });

  useEffect(() => {
    (async () => {
      await dispatch(actionGetPruductMisc());
    })();
  }, []);

  const handleSearchTextFieldOnChange = (event) => {
    setSearchTextFieldValue(event.target.value);
  };

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
      whitelistSet={collectionGodIdSet}
      listData={searchResultswithMisc}
      showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.SEARCH_TAB_INDEX)}
      keyName='GodId'
      onLoadData={() => dispatch(actionGetSearchResults(searchTextFieldValue))}
    />
  </>);
};
