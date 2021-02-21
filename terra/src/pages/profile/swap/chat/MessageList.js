import React, {useEffect} from 'react';
import Compose from './Compose';
import Message from './Message';
import moment from 'moment';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import clsx from 'clsx';

import {swapsActions} from '@/actionCreators';
import styles from './MessageList.module.css';


const MessageList = (props) => {
  const router = useRouter();

  const tick = (swapId) => {
    if (swapId) {
      props.getMsgList(swapId);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      props.getMsgList(router.query.id);
    }

    const intervalID = setInterval(
        () => tick(router.query.id),
        10000,
    );
    return () => clearInterval(intervalID);
  }, [router.query.id, props.currUser.id]);


  const {messages, currUser, currentSwap} = props;

  const renderMessages = () => {
    let i = 0;
    const messageCount = messages.length;

    const tempMessages = [];

    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const isMine = current.author.id === currUser.id;
      const currentMoment = moment(current.timeSent * 1000);
      let showTimestamp = false;

      if (previous) {
        const previousMoment = moment(previous.timeSent * 1000);

        if (!previousMoment.isSame(currentMoment, 'date')) {
          showTimestamp = true;
        }
      } else {
        showTimestamp = true;
      }

      tempMessages.push(
          <Message
            key={i}
            isMine={isMine}
            showTimestamp={showTimestamp}
            data={current}
          />,
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };

  return (
    <>
      <div className={clsx(styles.messageList, styles.scrollable)}>{renderMessages()}</div>
      {currentSwap && <Compose/>}
    </>
  );
};


function mapStateToProps(state) {
  return {
    messages: state.swaps.messages.sort((a, b) => a.timeSent - b.timeSent),
    currentSwap: state.swaps.currentSwap,
    currUser: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  getMsgList: swapsActions.getMsgList,
};

export default connect(mapStateToProps, actionCreators)(MessageList);
