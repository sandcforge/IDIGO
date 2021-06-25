import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';


import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from "@material-ui/core/Snackbar";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import StarsIcon from '@material-ui/icons/Stars';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import clsx from 'clsx';
import { APP_CONST, BUSINESS_CONST, UI_CONST } from '../constants.js';
import {
  actionAddProductToCollection,
  actionGetCollectionProducts,
  actionRemoveProductFromCollection,
  actionResetTab,
  actionUpdateCart
} from '../redux/actions.js';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    backgroundColor: red[500],
  },
  filmstripContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    width: '100%',
  },
  filmstripImage: {
    borderStyle: 'solid',
    borderWidth: 1,
    height: 200,
    margin: 1,
  },
  rawImage: {
    maxWidth: '100%',
  }
}));


export const ItemCard = (props) => {
  const { details, whitelistSet, defaultExpanded = false, disableExpand = false } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);
  const isCustomerService = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_CUSTOMER_SERVICE);
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const getBuyerPrice = (cost) => {
    return (cost * (isAdmin ? 1 : BUSINESS_CONST.GOODS_PROFIT)).toFixed(2);
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderCardContent = (details) => {
    const renderExtraInfo = () => {
      return (<>
        <TextListItem title='商品库存' content={details.GodSellStock} />
        <TextListItem title='商品品牌' content={details.GodBrand} />
        <TextListItem title='商品规格' content={details.GodSpecification} />
        <TextListItem title='商品重量' content={details.GodWeight} />
        <TextListItem title='商品卖家' content={details.GodPurchaseSource} />
        <TextListItem title='商品描述' content={details.GodDescription} />
        <TextListItem title='商品原价' content={details.GodOriginalPrice} />
        <TextListItem title='商品现价' content={details.GodPresentPrice} />
        <TextListItem title='商品编号' content={details.GodId} />
        <TextListItem title='商品条形码' content={details.GodBarcode} />
      </>);
    };

    return (<>
      <TextListItem title='商品名称' content={details.GodName} />
      <TextListItem title='商品价格' content={`\u00a5${getBuyerPrice(details.GodPresentPrice)}`} />
      <TextListItem title='商品代码' content={details.GodCode} />
      <TextListItem title='商品规格' content={details.GodSpecification} />
      <TextListItem title='商品介绍' content={details.GodAppDescribe} />
      {/* TODOs: Add a Clickable link here */}
      <TextListItem title='商品链接' content={`${APP_CONST.SITE_DOMAIN}/${APP_CONST.PRODUCT_PATH}/${details.GodId}`} />
      <div className={classes.filmstripContainer}>
        <Image url={details.GodImageUrl} />
        <Image url={details.GodImageUrl1} />
        <Image url={details.GodImageUrl2} />
        <Image url={details.GodImageUrl3} />
        <Image url={details.GodImageUrl4} />
        <Image url={details.GodImageUrl5} />
        <Image url={details.GodImageUrl6} />
        <Image url={details.GodImageUrl7} />
        <Image url={details.GodImageUrl8} />
      </div>
      {isAdmin && renderExtraInfo()}
    </>);
  };

  const renderEditActions = () => {
    return (isAdmin || isCustomerService) && (<>
      <CardActions>
        {isAdmin && (<><IconButton disabled>
          <StarsIcon color={whitelistSet.has(details.GodId) ? "primary" : "inherit"} />
        </IconButton>
          <IconButton
            color="secondary"
            onClick={async () => {
              dispatch(actionResetTab(UI_CONST.COLLECTION_TAB_INDEX));
              await dispatch(actionAddProductToCollection(details));
              await dispatch(actionGetCollectionProducts());
            }}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={async () => {
              dispatch(actionResetTab(UI_CONST.COLLECTION_TAB_INDEX));
              await dispatch(actionRemoveProductFromCollection(details));
              await dispatch(actionGetCollectionProducts());
            }}
          >
            <RemoveCircleIcon />
          </IconButton></>)}
        <IconButton
          color='primary'
          onClick={() => {
            dispatch(actionUpdateCart({
              productDetails: details,
              productNum: 1,
            }));
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
        <IconButton
          color='primary'
          onClick={() => {
            dispatch(actionUpdateCart({
              productDetails: details,
              productNum: -1,
            }));
          }}
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </CardActions>
    </>);
  };

  /**
   * Display logic
   * if whitelistSet === undefined:
   *    isAdmin  -> all features
   *    !isAdmin -> partial features
   * if whitelistSet is valid:
   *    isAdmin  -> all features
   *    !isAdmin & inWhitelist -> partial features
   *    !isAdmin & !inWhitelist -> hidden
   */
  if (!isAdmin && whitelistSet && !whitelistSet.has(details.GodId)) { return null; }
  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          onClick={disableExpand ? undefined : handleExpandClick}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              <img width='100%' height='100%' src={details.GodImageUrl} alt='avatar' />
            </Avatar>
          }
          title={details.GodAppTitle}
          subheader={`\u00a5${getBuyerPrice(details.GodPresentPrice)}`}
          action={
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        {renderEditActions()}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {renderCardContent(details)}
          </CardContent>
        </Collapse>
      </Card>
    </>
  );

};

const TextListItem = (props) => {
  const { title, content } = props;
  const [snackbarStatus, setSnackbarStatus] = React.useState(false);

  const showSnackbar = () => {
    setSnackbarStatus(true);
  };

  const hideSnackbar = (event, reason) => {
    setSnackbarStatus(false);
  };


  return (<>
    <ListItem alignItems="flex-start">
      <CopyToClipboard text={content} onCopy={() => { showSnackbar(); }}>
        <ListItemIcon ><IconButton><FileCopyIcon /></IconButton></ListItemIcon>
      </CopyToClipboard>
      <ListItemText primary={title} secondary={content} />
    </ListItem>
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={snackbarStatus}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      message={`复制到剪贴板：${content}.`}
    />
  </>);
};

const Image = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return props.url && (
    <>
      <img
        className={classes.filmstripImage}
        onClick={showModal}
        src={props.url}
        alt='没有图片' />
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <img
          className={classes.rawImage}
          onClick={handleClose}
          src={props.url}
          alt='没有图片' />
      </Dialog>
    </>
  );
};
