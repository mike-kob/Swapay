import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {
  Grid,
  Fab,
  useTheme,
  useMediaQuery,
  Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import {itemAdminActions, snackActions} from '../../../actionCreators';
import GameCard from './GameCard';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProfileNav from '@/components/ProfileNav';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: theme.spacing(3),
    minHeight: '50vh',
    position: 'relative',
  },
  icon: {
    color: '#FF7438',
  },
  button: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
    width: 'fit-content',
    alignSelf: 'flex-end',
    margin: '10px',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));


const MyGames = (props) => {
  useEffect(() => props.getPrivateItems(), []);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles(props);
  const router = useRouter();

  const renderItems = (items) => {
    return items.map((item) => {
      return (<Grid item xs={12} md={6} key={item.id}>
        <GameCard
          className={classes.card}
          key={item.id}
          item={item}
        />
      </Grid>);
    });
  };

  const handleAddItem = () => {
    props.createPrivateItem((id) => {
      props.showSnackbar('Added');
      router.push(`/${router.query.lang}/profile/game/${id}`);
    });
  };

  return (
    <>
      <Head>
        <title>My games - Swapay</title>
      </Head>
      <Header/>
      {matches ? <Breadcrumbs links={[['Profile', '/profile/settings'], 'My games']}/> :
      <ProfileNav/>}
      <div className={classes.root}>
        <Grid container spacing={3}>
          {renderItems(props.privateItems.sort((a, b) => b.created - a.created))}
        </Grid>
        <Box m={4}/>
        <Fab color="secondary" aria-label="add" className={classes.fab} onClick={handleAddItem}>
          <AddIcon/>
        </Fab>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    privateItems: state.item.privateItems,
  };
}

const actionCreators = {
  showSnackbar: snackActions.showSnackbar,
  createPrivateItem: itemAdminActions.createPrivateItem,
  getPrivateItems: itemAdminActions.getPrivateItems,
};


export default connect(mapStateToProps, actionCreators)(MyGames);
