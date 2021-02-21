import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import PhotoUpload from '@/components/PhotoUpload';
import ItemPhoto from '../ItemPhoto';
import {itemAdminActions} from '@/actionCreators';


const PhotosPaper = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {item, parentClasses} = props;


  return (
    <Paper className={parentClasses.paper}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={parentClasses.headers}>
            Let's add photos
            <IconButton onClick={() => setDialogOpen(true)}>
              <AddCircleIcon/>
            </IconButton>
            <PhotoUpload
              item={item}
              open={dialogOpen}
              setOpen={setDialogOpen}
              onSuccess={(image) => {
                props.createItemPhoto(item.id, image.public_id);
              }}
            />
          </Typography>

          <Grid container spacing={5} style={{minHeight: '100px'}}>
            {item.photos.sort((a, b) => a.id - b.id).map((photo, i) => (
              <ItemPhoto
                key={i}
                photo={photo}
                photo_ind={i}
                {...props}
              />))}
          </Grid>
        </Grid>

      </Grid>
    </Paper>
  );
};


function mapStateToProps(state) {
  return {
    item: state.item.item,
  };
}

const actionCreators = {
  modifyPrivateItem: itemAdminActions.modifyPrivateItem,
  updatePrivateItem: itemAdminActions.updatePrivateItem,
  activatePrivateItem: itemAdminActions.activatePrivateItem,
  createItemPhoto: itemAdminActions.createItemPhoto,
};

export default connect(mapStateToProps, actionCreators)(PhotosPaper);
