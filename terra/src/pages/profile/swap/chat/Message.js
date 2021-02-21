import React from 'react';
import moment from 'moment';
import clsx from 'clsx';

import styles from './Message.module.css';

export default function Message(props) {
  const {
    data,
    isMine,
    showTimestamp,
  } = props;

  const friendlyTimestamp = moment(data.timeSent*1000).format('YYYY-MM-DD');
  const time = moment(data.timeSent*1000).format('HH:mm');
  return (
    <div className={clsx(styles.message, styles.start, styles.end)}>
      {
        showTimestamp &&
            <div className={styles.timestamp}>
              { friendlyTimestamp }
            </div>
      }

      <div className={styles.bubble_container}>
        <div className={clsx(isMine ? styles.bubble : styles.otherbubble, isMine && styles.mine)} >
          { data.body }
          <div className={clsx(isMine ? styles.myTime : styles.clientTime)}>{time}</div>
        </div>
      </div>
    </div>
  );
}
