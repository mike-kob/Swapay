import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {makeStyles} from '@material-ui/core/styles';
import {
  Paper,
  Button,
  Typography,
  Grid,
  Box,
  Link as MuiLink,
  Divider,
  Avatar,
} from '@material-ui/core';

import {swapsActions} from '@/actionCreators';
import Messenger from './chat/Messenger';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

const useStyles = makeStyles((theme) => ({
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  infoPanel: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40%',
    },
  },
  messengerPanel: {
    width: '100%',
    height: '80vh',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  },
  paper: {
    borderRadius: '12px',
    margin: '20px',
    [theme.breakpoints.up(600)]: {
      margin: '20px 150px',
    },
    [theme.breakpoints.up(900)]: {
      margin: '20px 250px',
    },
    [theme.breakpoints.up('md')]: {
      margin: '0',
    },
  },
  headerGreen: {
    height: '40px',
    backgroundColor: '#2AA636',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    textTransform: 'uppercase',
    fontSize: '20px',
    color: 'white',
    width: '100%',
  },
  headerYellow: {
    height: '40px',
    backgroundColor: '#F0AE36',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    textTransform: 'uppercase',
    fontSize: '20px',
    color: 'white',
    width: '100%',
  },
  image: {
    height: '250px',
  },
  marg: {
    padding: '10px',
  },
  divider: {
    height: '2px',
  },
  root: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    border: 0,
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    color: 'white',
    height: 50,
    padding: '0 30px',
    width: '100%',
    outline: 'none',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
  },
  cardSection: {
    padding: '10px',
  },
  avatar: {
    float: 'right',
  },
}));

const TYPES = {
  'R': 'Rent',
  'P': 'Sell',
  'E': 'Exchange',
};

const EditSwap = (props) => {
  const router = useRouter();

  const {swap, user} = props;
  const classes = useStyles(props);

  useEffect(() => {
    if (router.query.id) {
      props.getSwap(router.query.id);
    }
  }, [router.query.id]);

  const partner = swap.client.id === user.id ? swap.owner : swap.client;

  return (
    <>
      <Header/>
      <Breadcrumbs links={[['Profile', '/profile/settings'], ['My swaps', '/profile/swaps'], 'Swap']}/>
      <div className={classes.layout}>
        <div className={classes.infoPanel}>
          <Paper className={classes.paper}>
            {
              (swap.accepted) ?
                <div className={classes.headerGreen}>
                  Approved
                </div> :
                <div className={classes.headerYellow}>
                  Waiting for approval
                </div>
            }

            <Grid container direction="column" style={{width: 'unset'}}>
              <Grid
                item xs={12}
                className={classes.cardSection}
              >
                <Typography variant="subtitle1" className={classes.title}>
                  {swap.item.title}
                </Typography>
                <Typography variant="subtitle2">
                  {' ' + TYPES[swap.type]}
                </Typography>
              </Grid>

              <Divider style={{width: '100%'}}/>

              <Grid
                item xs={12}
                direction="row"
                justify="flex-start"
                className={classes.cardSection}
                container
              >
                <Grid item xs={8}>
                  <Typography variant="subtitle1" className={classes.title}>
                    {partner.firstName} {partner.lastName}
                  </Typography>
                  <Typography variant="subtitle2">
                    @{partner.username}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Avatar className={classes.avatar} src={partner.avatar}/>
                </Grid>
              </Grid>

              {swap.clientContacts && <Grid item xs={12} className={classes.cardSection}>
                <MuiLink href={`tel:${swap.clientContacts}`}>
                  {swap.clientContacts}
                </MuiLink>
              </Grid>}

              <Divider style={{width: '100%'}}/>

              <Grid
                className={classes.cardSection}
                item
                container
                direction="row"
              >
                <Grid xs={8} item>
                  {
                    swap.type === 'P' ?
                      <Typography>Price:</Typography> :
                      <Typography>Price per day:</Typography>
                  }
                </Grid>

                <Grid item xs={4}>
                  {swap.type === 'P' ?
                    <Typography>{`${swap.item.sellPrice} UAH`}</Typography> :
                    <Typography>{`${swap.item.rentPrice} UAH`}</Typography>
                  }
                </Grid>
              </Grid>
            </Grid>

            {
              swap.owner.id === props.user.id && !swap.accepted ?
                <Button
                  onClick={() => props.editSwap(swap.id, {accepted: true})}
                  className={classes.root}
                >
                  Approve {swap.type === 'P' ? 'selling' : 'rent'}</Button> :
                <></>
            }

          </Paper>
        </div>
        <Box m={2}/>
        <div className={classes.messengerPanel}>
          <Messenger/>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    swap: state.swaps.currentSwap,
    user: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  getSwap: swapsActions.getSwap,
  editSwap: swapsActions.editSwap,
  modifyCurrentSwap: swapsActions.modifyCurrentSwap,
};

export default connect(mapStateToProps, actionCreators)(EditSwap);
