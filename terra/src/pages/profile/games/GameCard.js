import React, {useState} from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {useRouter} from 'next/router';
import {Image} from 'cloudinary-react';

import {itemAdminActions, snackActions} from '@/actionCreators';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: 400,
    // height: '100%',
    minHeight: '200px',
    margin: 'auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    display: 'none',
    width: '30%',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  mobileCover: {
    height: '200px',
    backgroundSize: 'contain',
    margin: '0 10px',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginLeft: 'auto',
  },
  button: {
    borderColor: '#FF7438',
    color: '#FF7438',
    margin: '5px',
  },
  regButton: {
    backgroundColor: '#FF7438',
    color: 'white',
    margin: '5px',
  },
  activeCaption: {
    padding: theme.spacing(0.25, 0.5),
    backgroundColor: '#cdd13c85',
    borderRadius: theme.spacing(0.5),
    color: '#555800',
  },
  inactiveCaption: {
    padding: theme.spacing(0.25, 0.5),
    backgroundColor: '#d3d3d38a',
    borderRadius: theme.spacing(0.5),
    color: '#454545',
  },
  infoCaption: {
    color: '#454545',
    display: 'block',
  },
}));


const GameCard = (props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles(props);
  const router = useRouter();

  const {item} = props;
  const itemPhoto = item.photos.find((o) => o.main);
  return (
    <Card className={classes.root}>
      <Image className={classes.cover} cloudName="swapay" publicId={itemPhoto ? itemPhoto.publicId: ''} width="300" />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {item.title}
          </Typography>
          {item.activated ?
            <Typography component="span" variant="caption" className={classes.activeCaption}>
              Active
            </Typography> :
            <Typography component="span" variant="caption" className={classes.inactiveCaption}>
              Inactive
            </Typography>
          }
          {Boolean(item.sellPrice) &&
          <Typography component="span" variant="caption" className={classes.infoCaption}>
            • Sell: {item.sellPrice} UAH
          </Typography>}

          {Boolean(item.rentPrice) &&
          <Typography component="span" variant="caption" className={classes.infoCaption}>
            • Rent: {item.rentPrice} UAH/day
          </Typography>}

          {Boolean(item.exchangeDescription) &&
          <Typography component="span" variant="caption" className={classes.infoCaption}>
            • Exchange
          </Typography>}


        </CardContent>
        <CardMedia
          className={classes.mobileCover}
          image={itemPhoto ? itemPhoto.file : ''}
          title="Cover photo for item"
        />
        <div className={classes.controls}>
          <Button data-test-item-id={item.id} className={classes.button} variant="outlined" size="small"
            color="default" onClick={() => setOpen(true)}>
            <DeleteForeverIcon/>
          </Button>
          <Button className={classes.regButton} variant="contained"
            size="small"
            onClick={() => router.push(`/${router.query.lang}/profile/game/${item.id}`)}>
            Edit
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Do you want to remove this game?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)} autoFocus color="primary">
              No
            </Button>
            <Button onClick={() => {
              props.deletePrivateItem(item.id,
                  () => props.showSnackbar('Removed'),
                  (error) => props.showSnackbar(error));
              setOpen(false);
            }}
            data-test-id="delete"
            color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Card>
  );
};

function mapStateToProps(state) {
  return {};
}

const actionCreators = {
  deletePrivateItem: itemAdminActions.deletePrivateItem,
  showSnackbar: snackActions.showSnackbar,
};


export default connect(mapStateToProps, actionCreators)(GameCard);
