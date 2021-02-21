import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
} from '@material-ui/core';

import {itemAdminActions} from '@/actionCreators';


const MainInfoPaper = (props) => {
  const {parentClasses, item} = props;

  return (
    <Paper className={parentClasses.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={parentClasses.headers}>
            Main
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            variant="outlined"
            label="Name in ukrainian"
            className={parentClasses.fields}
            value={item.ukTitle}
            onChange={(e) => props.modifyPrivateItem({ukTitle: e.target.value})}/>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Name in english"
            className={parentClasses.fields}
            value={item.enTitle}
            helperText="2-5 words that best describe you game"
            onChange={(e) => props.modifyPrivateItem({enTitle: e.target.value})}/>
        </Grid>

        <Box m={1.5}/>

        <Grid item xs={12}>
          <TextField
            multiline
            required
            fullWidth
            variant="outlined"
            rows={2}
            className={parentClasses.fields}
            label="Small preview in Ukrainian"
            value={item.ukPreview}
            onChange={(e) => props.modifyPrivateItem({ukPreview: e.target.value})}/>
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={2}
            className={parentClasses.fields}
            label="Small preview in English"
            helperText="2-4 sentences that people will see before going to the game page"
            value={item.enPreview}
            onChange={(e) => props.modifyPrivateItem({enPreview: e.target.value})}/>
        </Grid>

        <Box m={1.5}/>

        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={12}
            className={parentClasses.fields}
            label="Describe your game in Ukrainian"
            value={item.ukDescription}
            onChange={(e) => props.modifyPrivateItem({ukDescription: e.target.value})}/>
        </Grid>

        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={12}
            className={parentClasses.fields}
            label="Describe your game in English"
            value={item.enDescription}
            onChange={(e) => props.modifyPrivateItem({enDescription: e.target.value})}/>
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
};

export default connect(mapStateToProps, actionCreators)(MainInfoPaper);
