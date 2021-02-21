import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {
  Button,
  Grid,
  Box,
  Card,
  Typography,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import DoneIcon from '@material-ui/icons/Done';
import {Image} from 'cloudinary-react';

import {itemAdminActions} from '@/actionCreators';

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    minHeight: '250px',
  },
  card: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffe4b14a',
    margin: 'auto',
  },
  tooltip: {
    fontSize: 'small',
    textAlign: 'center',
  },
}));


const ItemPhoto = (props) => {
  const classes = useStyles();
  const {photo} = props;

  const onDelete = (e) => {
    if (photo.id) {
      props.deleteItemPhoto(photo.id);
    }
  };

  const onMain = (e) => {
    if (photo.id) {
      props.updateItemPhoto(photo.id, {main: true});
    }
  };

  return (
    <Grid item xs={12} sm={6}>
      <Card className={classes.card}>

        <Image cloudName="swapay" publicId={photo.publicId} width="300" crop="scale" />

        <Box m={1}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {!photo.main ?
                <Tooltip title="Set as cover"
                  classes={{tooltip: classes.tooltip}}
                  aria-label="add" placement={'top'}>
                  <IconButton variant="contained"
                    className={classes.cardButton}
                    component="label"
                    color={'primary'}
                    fullWidth={true}
                    onClick={onMain}>
                    <DoneIcon/>
                  </IconButton>
                </Tooltip> :
                <Typography>
                  Cover photo
                </Typography>
              }
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained"
                // startIcon={<DeleteTwoToneIcon />}
                className={classes.cardButton}
                component="label"
                color={'primary'}
                fullWidth={true}
                onClick={onDelete}>
                <DeleteTwoToneIcon/>
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box m={0.5}/>

      </Card>
    </Grid>

  );
};


function mapStateToProps(state) {
  return {};
}

const actionCreators = {
  deleteItemPhoto: itemAdminActions.deleteItemPhoto,
  updateItemPhoto: itemAdminActions.updateItemPhoto,
};

export default connect(mapStateToProps, actionCreators)(ItemPhoto);
