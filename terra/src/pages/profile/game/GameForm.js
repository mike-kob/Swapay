import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {makeStyles} from '@material-ui/core/styles';

import {itemAdminActions, snackActions} from '@/actionCreators';
import MainInfoPaper from './sections/MainInfoPaper';
import PhotosPaper from './sections/PhotosPaper';
import PricePaper from './sections/PricePaper';
import AdditionalInfoPaper from './sections/AdditionalInfoPaper';
import StatusPaper from './sections/StatusPaper';
import ActionPaper from './sections/ActionPaper';
import AnchorPaper from './sections/AnchorPaper';


const useStyles = makeStyles((theme) => ({
  twoColumns: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      width: '65%',
      padding: theme.spacing(4),
      margin: 0,
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  headers: {
    fontStyle: 'normal',
    fontWeight: '600',
  },
  littleHeader: {
    fontSize: '10px',
  },
  divider: {
    height: '2px',
  },
  fields: {
    margin: theme.spacing(0, 1),
  },
  color: {
    color: 'black',
  },
  price: {
    width: '100px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  sidePanel: {
    padding: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '35%',
    },
  },
  stickyBar: {
    position: 'sticky',
    top: theme.spacing(2),
  },
}));


const GameForm = (props) => {
  const classes = useStyles(props);
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      props.getPrivateItemInfo(router.query.id);
      props.getGameTags();
    }
  }, [router.query.id]);

  return (
    <div className={classes.twoColumns}>
      <div className={classes.layout}>
        <a id="main"/>
        <MainInfoPaper parentClasses={classes}/>

        <a id="photo"/>
        <PhotosPaper parentClasses={classes}/>

        <a id="price"/>
        <PricePaper parentClasses={classes}/>

        <a id="additional"/>
        <AdditionalInfoPaper parentClasses={classes}/>
      </div>

      <div className={classes.sidePanel}>
        <div className={classes.stickyBar}>
          <StatusPaper parentClasses={classes}/>

          <ActionPaper parentClasses={classes}/>

          <AnchorPaper parentClasses={classes}/>
        </div>
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    item: state.item.item,
  };
}

const actionCreators = {
  getPrivateItemInfo: itemAdminActions.getPrivateItemInfo,
  modifyPrivateItem: itemAdminActions.modifyPrivateItem,
  updatePrivateItem: itemAdminActions.updatePrivateItem,
  activatePrivateItem: itemAdminActions.activatePrivateItem,
  createItemPhoto: itemAdminActions.createItemPhoto,
  getGameTags: itemAdminActions.getGameTags,
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(GameForm);
