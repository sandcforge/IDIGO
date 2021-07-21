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
import { Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import clsx from 'clsx';
import { APP_CONST, BUSINESS_CONST, UI_CONST } from '../constants.js';

import {
  actionAddProductToCollection,
  actionGetCollectionProducts,
  actionRemoveProductFromCollection,
  actionResetTab,
  actionUpdateCart,
  actionUpdateProductCopyWriting,
} from '../redux/actions.js';
import { getBuyerPrice } from '../utils.js';
import { TextEditor } from './TextEditor.js';
import { Link } from '@material-ui/icons';

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
  },
  subheaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
}));

const COLLAPSE_STATUS = {
  UNEXPANDED: 'unexpanded',
  PRODUCT_MORE_DETAILS: 'more',
  COLLECTION_ACTIONS: 'collection',
  CART_ACTIONS: 'cart',
  COPYWRITING_ACTIONS: 'copywritng',
};


export const ItemCard = (props) => {
  const { details, defaultExpanded = COLLAPSE_STATUS.UNEXPANDED, disableExpand = false, star = false, amount = -1 } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);
  const isCustomerService = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_CUSTOMER_SERVICE);
  const customerService = useSelector(state => state.app.customerService);
  const canRenderExtraInfo = isAdmin;
  const canManageCollection = isAdmin;
  const canManageCart = isAdmin || isCustomerService;
  const canModifyCopyWriting = isAdmin || isCustomerService;

  const numInCart = useSelector(state => {
    const matchedItem = state.ui.cart.find(item => item.productDetails.GodCode === details.GodCode);
    if (matchedItem) {
      return matchedItem.productNum;
    }
    else {
      return 0;
    }
  });

  const [collaspeStatus, setCollaspeStatus] = React.useState(defaultExpanded);

  const handleActionIcon = (event) => {
    if (collaspeStatus === event.currentTarget.id) {
      setCollaspeStatus(COLLAPSE_STATUS.UNEXPANDED);
    }
    else {
      setCollaspeStatus(event.currentTarget.id);
    }

  }


  const renderCardContent = () => {

    const handleOnCancel = () => {
      setCollaspeStatus(COLLAPSE_STATUS.UNEXPANDED);
    };

    const handleOnConfirm = async (text) => {
      await dispatch(actionUpdateProductCopyWriting({
        _customerService: customerService,
        GodAppTitle: details.GodAppTitle,
        GodCode: details.GodCode,
        GodId: details.GodId,
        _copywriting: text,
      }));
      setCollaspeStatus(COLLAPSE_STATUS.UNEXPANDED);
    }

    switch (collaspeStatus) {
      case COLLAPSE_STATUS.PRODUCT_MORE_DETAILS:
        return renderProductDetails(details);
      case COLLAPSE_STATUS.COPYWRITING_ACTIONS:
        return (<TextEditor
          name='更改文案'
          initialText={(details._ && details._._copywriting) || details.GodAppDescribe}
          onCancel={handleOnCancel}
          onConfirm={handleOnConfirm}
        />);
      case COLLAPSE_STATUS.CART_ACTIONS:
        return renderCartActions();
      case COLLAPSE_STATUS.COLLECTION_ACTIONS:
        return renderCollectionActions();
    }
  };

  const renderProductDetails = (details) => {
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
      <TextListItem title='商品介绍' content={(details._ && details._._copywriting) || details.GodAppDescribe} />
      {/* TODOs: Add a Clickable link here */}
      <TextListItem
        isUrl={true}
        title='商品链接'
        content={`${APP_CONST.SITE_DOMAIN}/${APP_CONST.PRODUCT_PATH}/${details.GodId}`}
      />
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
      {canRenderExtraInfo && renderExtraInfo()}
    </>);
  };

  const renderCollectionActions = () => {
    return (<div className={classes.actionContainer}>
      <IconButton disabled>
        <StarsIcon color={star ? "primary" : "inherit"} />
      </IconButton>
      <div >
        <IconButton
          color="secondary"
          onClick={() => dispatch(actionAddProductToCollection(details))}
        >
          <AddCircleIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => dispatch(actionRemoveProductFromCollection(details))}
        >
          <RemoveCircleIcon />
        </IconButton>
      </div>

    </div>);
  };

  const renderCartActions = () => {
    return (<div className={classes.actionContainer}>
      <div>
        <IconButton disabled={true}>
          <ShoppingCartIcon color='primary' />
        </IconButton>
        {numInCart}
      </div>
      <div>
        <IconButton
          color="secondary"
          onClick={() => {
            dispatch(actionUpdateCart({
              productDetails: details,
              productNum: 1,
            }));
          }}
        >
          <AddCircleIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => {
            dispatch(actionUpdateCart({
              productDetails: details,
              productNum: -1,
            }));
          }}
        >
          <RemoveCircleIcon />
        </IconButton>
      </div>
    </div>);
  };

  const renderSubHeader = () => {
    return (
      <div className={classes.subheaderContainer}>
        <div>{`\u00a5${getBuyerPrice(details.GodPresentPrice)}`}</div>
        {(amount >= 0) && <div>x {amount}</div>}
      </div>
    );
  };


  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          onClick={disableExpand ? undefined : handleActionIcon}
          id={COLLAPSE_STATUS.PRODUCT_MORE_DETAILS}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              <img width='100%' height='100%' src={details.GodImageUrl} alt='avatar' />
            </Avatar>
          }
          title={details.GodAppTitle}
          subheader={renderSubHeader()}
          action={
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: collaspeStatus === COLLAPSE_STATUS.PRODUCT_MORE_DETAILS,
              })}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <CardActions>
          {canManageCollection &&
            <IconButton id={COLLAPSE_STATUS.COLLECTION_ACTIONS} onClick={handleActionIcon}>
              <StarsIcon color='primary' />
            </IconButton>}
          {canManageCart &&
            <IconButton id={COLLAPSE_STATUS.CART_ACTIONS} onClick={handleActionIcon}>
              <ShoppingCartIcon color='primary' />
            </IconButton>}
          {canModifyCopyWriting &&
            <IconButton id={COLLAPSE_STATUS.COPYWRITING_ACTIONS} onClick={handleActionIcon}>
              <EditIcon color='primary' />
            </IconButton>}
        </CardActions>
        <Collapse in={collaspeStatus !== COLLAPSE_STATUS.UNEXPANDED} timeout="auto" unmountOnExit>
          <CardContent>
            {renderCardContent()}
          </CardContent>
        </Collapse>
      </Card>
    </>
  );

};

const TextListItem = (props) => {
  const { title, content, isUrl = false } = props;
  const [snackbarStatus, setSnackbarStatus] = React.useState(false);

  const showSnackbar = () => {
    setSnackbarStatus(true);
  };

  const hideSnackbar = (event, reason) => {
    setSnackbarStatus(false);
  };

  const renderContent = () => {
    return isUrl ?
      (
        <a
          href={`https://${content}`}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      ) : content;
  };
  return (<>
    <ListItem alignItems="flex-start">
      <CopyToClipboard text={content} onCopy={() => { showSnackbar(); }}>
        <ListItemIcon ><IconButton><FileCopyIcon /></IconButton></ListItemIcon>
      </CopyToClipboard>
      <ListItemText style={{ whiteSpace: 'pre-wrap' }} primary={title} secondary={renderContent()} />
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