import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';

import styles from './ConversationListItem.module.css';

function ConversationListItem(props) {
  const {user2, user1, id} = props.data;
  const {currConv, currUser} = props;

  const partner = (currUser.id === user1.id) ? user2 : user1;

  return (
    <div
      className={currConv && currConv.id === id ? 'conversation-list-item-selected conversation-list-item' : 'conversation-list-item'}>
      <Avatar className={'conversation-photo'}
        alt={partner.username}
        src={partner.photo ? JSON.parse(partner.photo.info)['100x100'] : ''}
      >
      </Avatar>
      <div className={styles.conversationInfo}>
        {partner.username}
      </div>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    currConv: state.chat.currConv,
    currUser: state.privateProfile.privateProfile,
  };
}

const actionCreators = {};

export default connect(mapStateToProps, actionCreators)(ConversationListItem);
