import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';

import {authActions} from '../../actionCreators';
import Header from '../../components/Header';

const Logout = (props) => {
  const router = useRouter();

  useEffect(() => {
    props.logout(() => {
      if (router.query.next) {
        window.location.href = router.query.next;
        return;
      }

      window.location.href = '/';
    });
  });

  return (
    <>
      <Header/>
      <div style={{height: '50vh'}}>Зачекайте хвилику</div>
    </>
  );
};


function mapStateToProps() {
  return {};
}

const actionCreators = {
  logout: authActions.logout,

};

export default connect(mapStateToProps, actionCreators)(Logout);
