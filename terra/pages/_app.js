import React, {useEffect} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {connect, Provider} from 'react-redux';
import {IntlProvider} from 'react-intl';
import Router from 'next/router';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

import theme from '@/theme';
import store from '@/store';
import MessageSnackbar from '@/components/MessageSnackbar';
import {privateProfileActions} from '@/actionCreators';
import Footer from '@/components/Footer';
import messages from '../translations';

import './main.css'

// Binding events.
NProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


export default function MyApp(props) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <ConnectedReduxApp {...props}/>
      </Provider>
    </>
  );
};


const ReduxApp = (props) => {
  const {Component, pageProps, router} = props;

  useEffect(() => {
    if (localStorage && localStorage.getItem('loggedIn')) {
      props.getPrivateProfile();
    }
  }, []);

  return (
    <>
      <IntlProvider locale={router.query.lang} messages={messages[router.query.lang]} defaultLocale="en">
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Component {...pageProps} />
          <Footer/>
          <MessageSnackbar/>
        </ThemeProvider>
      </IntlProvider>
    </>
  );
};

function mapStateToProps(state) {
  return {
    user: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  getPrivateProfile: privateProfileActions.getPrivateProfile,
};

const ConnectedReduxApp = connect(mapStateToProps, actionCreators)(ReduxApp);
