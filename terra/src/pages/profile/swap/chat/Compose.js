import React from 'react';
import {connect} from 'react-redux';
import {
  InputBase,
  SvgIcon,
  Box,
} from '@material-ui/core';

import {swapsActions} from '@/actionCreators';
import styles from './Compose.module.css';


const Compose = (props) => {
  const {currentSwap} = props;
  const [msg, setMsg] = React.useState('');

  const onSubmit = () => {
    if (msg) {
      const data = {
        swap: currentSwap.id,
        body: msg,
      };
      props.postMessage(data);
      setMsg('');
    }
  };

  return (
    <div className={styles.compose}>
      <div className={styles.root}>
        <InputBase
          className={styles.input}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={(event) => {
            if (!event.ctrlKey && event.key === 'Enter') {
              onSubmit();
            }
          }}
          placeholder="Write..."
          multiline={true}
          rowsMax="6"
        />
        <Box component="div" display="flex" flexDirection="column" justifyContent="start" className={styles.arrow}>
          <SvgIcon className={styles.iconButton} viewBox="0 0 31 33" onClick={onSubmit}>
            <path d="M30.9858 16.3782L0 32.7565L6.49703 16.3782L0 0L30.9858 16.3782Z" fill="#DD4B24"/>
          </SvgIcon>
        </Box>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentSwap: state.swaps.currentSwap,
  };
};

const actionCreators = {
  postMessage: swapsActions.postMessage,
};

export default connect(mapStateToProps, actionCreators)(Compose);
