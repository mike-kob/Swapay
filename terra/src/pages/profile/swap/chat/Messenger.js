import React from 'react';

import MessageList from './MessageList';
import styles from './Messenger.module.css';

export default function Messenger(props) {
  return (
    <div className={styles.messenger}>
      <div className={styles.content}>
        <MessageList />
      </div>
    </div>
  );
}
