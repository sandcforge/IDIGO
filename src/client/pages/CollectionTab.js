import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import cover from '../../../public/cover.jpg';
import { ListView } from '../components/ListView.js';
import { UI_CONST } from '../constants.js';
import {
  actionGetCollectionProducts,
} from '../redux/actions.js';
import { Divider } from '@material-ui/core';
import { showLoadMoreButtonOnTab } from '../utils';

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
  const collectionGodIdSet = useSelector(state => new Set(state.data.collectionProducts.map(item => item.GodId)));


  useEffect(() => {
    dispatch(actionGetCollectionProducts());
  }, []);

  return (<>
    <img className={classes.cover} src={cover} />
    <h4>关于开市客（Costco）</h4>
    <p>
    爆火的开市客是全世界销售量最大的连锁会员制的仓储批发卖场。在美国是仅次于沃尔玛、亚马逊的第三大零售商。目前，在全球七个国家设有超过500家的分店。2019年，中国第一家分店在上海开业第一天时，一度引发抢购潮。开业仅三天，价格为299元的会员卡注册人数就超过10万。
    </p>
    <h4>关于爱代购（IDIGO）</h4>
    <p>
    爱代购成立于2015年，是一家深耕国际市场的电商平台，专注于提供美国的热销商品。我们的使命是：将开市客最优质的商品带到你的身边，让你在任何地方都能享受到开市客的商品和服务。
    </p>
    <h4>加客服微信下单</h4>
    <p>客服1: Milk_baby520</p>
    <p>客服2: Vincent61051030</p>
    <Divider />
    <Divider />
    <Divider />
    <ListView
      whitelistSet={collectionGodIdSet}
      listData={collectionProducts}
      showLoadMoreButton={showLoadMoreButtonOnTab(UI_CONST.COLLECTION_TAB_INDEX)}
      keyName='GodId'
      onLoadData={() => dispatch(actionGetCollectionProducts())}
    />
  </>);
};