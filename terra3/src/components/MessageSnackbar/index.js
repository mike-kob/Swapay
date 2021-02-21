import React from 'react';
import {connect} from 'react-redux';
import {
  Snackbar,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {snackActions} from '../../actionCreators';


const MessageSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={props.open}
      autoHideDuration={5000}
      onClose={props.hideSnackbar}
      message={props.message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={props.hideSnackbar}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        </React.Fragment>
      }
      data-test-id="snackbar"
    />
  );
};

function mapStateToProps(state) {
  return {
    open: state.snackbar.open,
    message: state.snackbar.message,
  };
}

const actionCreators = {
  hideSnackbar: snackActions.hideSnackbar,
};

export default connect(mapStateToProps, actionCreators)(MessageSnackbar);
