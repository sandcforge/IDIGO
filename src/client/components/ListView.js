import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ItemCard } from './ItemCard.js';


export const ListView = (props) => {
  const { Content = ItemCard,
    whitelistSet = undefined,
    listData,
    keyName,
    onLoadData,
    showLoadMoreButton,
    ...other } = props;

  //A padding to avoid the mobile phone gesture area at the bottom.
  const Padding = () => (<Typography
    component='span'
    style={{ height: "12vh" }}
  />);

  return (<>
    {listData.map((item) => <Content whitelistSet={whitelistSet} key={item[keyName]} details={item} />)}
    {showLoadMoreButton && (<Container>
      <Button
        variant="contained"
        color="primary"
        fullWidth={true}
        onClick={onLoadData}
      >
        加载更多
        </Button>
      <Padding />
    </Container>)}
  </>
  );
};

ListView.propTypes = {
  listData: PropTypes.array.isRequired,
  keyName: PropTypes.string.isRequired,
  onLoadData: PropTypes.func.isRequired,
  showLoadMoreButton: PropTypes.bool,
};