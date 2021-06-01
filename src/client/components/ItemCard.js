import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Snackbar from "@material-ui/core/Snackbar";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';

import clsx from 'clsx';
import { APP_CONST, BUSINESS_CONST} from '../constants';

const getBuyerPrice = (cost) => (cost*BUSINESS_CONST.GOODS_PROFIT).toFixed(2) ;

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
  image: {
    borderStyle: 'solid',
    borderWidth: 1,
    height: 200,
    margin: 1,
  }
}));



export const ItemCard = (props) => {
  const classes = useStyles();
  const isAdmin = useSelector(state => state.app.accessRole === APP_CONST.ACCESS_ROLE_ADMIN);

  const [expanded, setExpanded] = React.useState(false);
  const {details} = props;
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
      <div className={classes.filmstripContainer}>
          <img className={classes.image} src={details.GodImageUrl} alt={'0'} />
          { details.GodImageUrl1 ? <img className={classes.image} src={details.GodImageUrl1} alt={1} /> : null }
          { details.GodImageUrl2 ? <img className={classes.image} src={details.GodImageUrl2} alt={2} /> : null }
          { details.GodImageUrl3 ? <img className={classes.image} src={details.GodImageUrl3} alt={3} /> : null }
          { details.GodImageUrl4 ? <img className={classes.image} src={details.GodImageUrl4} alt={4} /> : null }
          { details.GodImageUrl5 ? <img className={classes.image} src={details.GodImageUrl5} alt={5} /> : null }
          { details.GodImageUrl6 ? <img className={classes.image} src={details.GodImageUrl6} alt={6} /> : null }
          { details.GodImageUrl7 ? <img className={classes.image} src={details.GodImageUrl7} alt={7} /> : null }
          { details.GodImageUrl8 ? <img className={classes.image} src={details.GodImageUrl8} alt={8} /> : null }
      </div>
      {isAdmin && renderExtraInfo() }
    </>);
  };

  return (
    <>
    <Card className={classes.root}>
      <CardHeader
        onClick={handleExpandClick}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <img width='100%' height='100%' src={details.GodImageUrl} alt='avatar'/>
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
  const {title, content} = props;
  const [snackbarStatus, setSnackbarStatus] = React.useState(false);

  const showSnackbar = () => {
    setSnackbarStatus(true);
  };

  const hideSnackbar = (event, reason) => {
    setSnackbarStatus(false);
  };


  return (<>
    <ListItem alignItems="flex-start">
    <CopyToClipboard text={content} onCopy={()=>{showSnackbar();}}>
      <ListItemIcon ><IconButton><FileCopyIcon /></IconButton></ListItemIcon>
    </CopyToClipboard>
    <ListItemText primary={title} secondary={content}/>
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