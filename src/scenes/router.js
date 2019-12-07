import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import Header from 'src/components/Header/Header';

const routes = {
  home: '/',
  auth: '/auth',
};

const Router = () => {
  return (
    <div className="center uk-width-4-5@l uk-width-4-5@m uk-width-4-5@s">
      <Header />
      <Switch>
        <Route exact path={routes.home} component={Home} />
        <Route path={routes.auth} component={Auth} />
      </Switch>
    </div>
  );
};

export default Router;
