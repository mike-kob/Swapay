import React from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {makeStyles} from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Box,
  Button,
} from '@material-ui/core';
import {Image} from 'cloudinary-react';

import {swapsActions} from '@/actionCreators';
import {useRouter} from 'next/router';

const TYPES = {
  'R': 'Rent',
  'P': 'Sell',
  'E': 'Exchange',
};

const useStyles = makeStyles((theme) => ({
  mainPhoto: {
    width: '100%',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.up('sm')]: {
      borderBottomLeftRadius: '10px',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '0',
    },
  },
  background: {
    backgroundColor: '#F8F6F4',
    borderRadius: '10px',
  },
  orangeButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white',
    width: '100%',
    // height: '100%',
    borderRadius: '0',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    [theme.breakpoints.up('sm')]: {
      borderBottomLeftRadius: '0',
    },
  },
  padding: {
    padding: '0 0 0 10px',
  },
  end: {
    marginTop: 'auto',
  },
  root: {
    paddingTop: '20px',
    flexBasis: 'auto!important',
  },
  hasUpdates: {
    backgroundColor: theme.palette.secondary.main,
    width: 'fit-content',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.2, 0.5),
    color: 'white',
  },
}));


const SwapCard = (props) => {
  const router = useRouter();
  const classes = useStyles(props);
  const {swap} = props;

  const userLink = (user) => (
    <Link href={`/${router.query.lang}/user/${user.id}`}><span>@{user.username}</span></Link>
  );

  const itemPhoto = swap.item && swap.item.photos ? swap.item.photos.find((o) => o.main) : {};

  return (
    <Grid className={classes.root} container item xs={12} justify={'center'}>
      <Grid className={classes.background} container item xs={11} sm={7} md={5} lg={4} key={swap.id}>
        <Grid item xs={12} sm={3} md={4}>
          <Image className={classes.cover} cloudName="swapay" publicId={itemPhoto ? itemPhoto.publicId: ''} width="100%" />
        </Grid>

        <Grid container item xs={12} sm={9} md={8} direction={'column'}>
          <Grid container item direction={'column'} className={classes.padding}>
            <Typography variant="h5">
              {swap.item.title}
            </Typography>
            <Typography>
              {TYPES[swap.type] || ''}
            </Typography>

            <Box m={1}>
              {swap.hasUpdates && <span className={classes.hasUpdates}>New messages</span>}
            </Box>

            <Typography variant="body1">
              Owner: {swap.owner.id === props.user.id ? 'You' : userLink(swap.owner)}
            </Typography>
            <Typography variant="body1">
              Initiator: {swap.client.id === props.user.id ? 'You' : userLink(swap.client)}
            </Typography>
            <Box m={0.5}/>
          </Grid>
          <Grid className={classes.end}>
            <Button
              data-test-swap-id={swap.id}
              onClick={props.onClick}
              className={classes.orangeButton}
            >Details</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
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


export default connect(mapStateToProps, actionCreators)(SwapCard);
