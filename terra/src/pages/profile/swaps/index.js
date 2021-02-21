import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
  Grid,
  Box, useTheme, useMediaQuery,
} from '@material-ui/core';

import {swapsActions} from '@/actionCreators';
import SwapCard from './SwapCard';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProfileNav from '@/components/ProfileNav';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 'auto',
    minHeight: '50vh',
  },
  icon: {
    color: '#F0AE36',
  },
  greenIcon: {
    color: '#2AA636',
  },
  safariFlexFix: {
    flexBasis: 'auto!important',
  },
}));


const MySwapsPanel = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  useEffect(() => {
    props.getSwapsList();
  }, []);

  const renderSwaps = (swaps) => swaps.map((swap) => {
    return (
      <SwapCard swap={swap} key={swap.id} onClick={() => {
        router.push(`/${router.query.lang}/profile/swap/${swap.id}`);
      }}/>
    );
  });


  const list = props.swaps.sort((a, b) => b.id - a.id);

  return (
    <>
      <Head>
        <title>Мої свапи - Swapay</title>
      </Head>
      <Header/>
      {matches ? <Breadcrumbs links={[['Profile', '/profile/settings'], 'My swaps']}/> :
        <ProfileNav/>}
      <div className={classes.root}>
        {Boolean(list.length) &&
        <>
          <Box m={1}/>
          <Grid container direction={'column'}>
            <Grid container item xs={12} justify={'center'}
              className={classes.safariFlexFix}>
              <Grid container item xs={11} md={4} lg={3}
                className={classes.safariFlexFix}>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid className={classes.icon} item>
                    <WatchLaterIcon/>
                  </Grid>
                  <Grid item>
                    Waiting for approve
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {renderSwaps(list.filter((el) => !el.accepted))}
            <Grid container style={{marginTop: '24px'}}
              item xs={12} justify={'center'} className={classes.safariFlexFix}>
              <Grid container item xs={11} md={4} lg={3}
                className={classes.safariFlexFix}>
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid className={classes.icon} item>
                    <CheckCircleIcon className={classes.greenIcon}/>
                  </Grid>
                  <Grid item>
                    Approved
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {renderSwaps(list.filter((el) => el.accepted))}
          </Grid>
        </>}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    swaps: state.swaps.swaps,
    user: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  getSwapsList: swapsActions.getSwapsList,
};


export default connect(mapStateToProps, actionCreators)(MySwapsPanel);
