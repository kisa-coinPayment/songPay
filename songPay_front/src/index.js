import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';

import 'assets/scss/material-kit-react.scss?v=1.8.0';

// pages for this product
import Components from 'views/Components/Components.js';
import LandingPage from 'views/LandingPage/LandingPage.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';
import AuthPage from 'views/AuthPage/AuthPage';
import QrcodePage from 'views/QrcodePage/QrcodePage';
import MypagePage from 'views/MypagePage/MypagePage';
import TestPage from 'views/TestPage/TestPage';

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path='/landing-page' component={LandingPage} />
      <Route path='/profile-page' component={ProfilePage} />
      <Route path='/login-page' component={LoginPage} />
      <Route path='/qrcode-page' component={QrcodePage} />
      <Route path='/mypage-page' component={MypagePage} />
      <Route path='/auth-page' component={AuthPage} />
      <Route path='/test-page' component={TestPage} />
      <Route path='/' component={LandingPage} />
      <Route path='/components' component={Components} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
