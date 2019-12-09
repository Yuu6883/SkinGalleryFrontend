import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from 'src/components/Header/Header';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import { observer } from 'mobx-react';
import { useStore } from 'src/stores/createStore';

export const routes = {
  home: '/',
  auth: '/auth',
};

const Router = () => {
  const user = useStore((store) => !!store.viewer.user);

  return (
    <div className="center uk-width-4-5@l uk-width-4-5@m uk-width-4-5@s">
      <Header />
      <Switch>
        <PrivateRoute
          exact
          path={routes.home}
          component={Home}
          auth={user}
          to={routes.auth}
        />
        <PrivateRoute
          path={routes.auth}
          component={Auth}
          auth={!user}
          to={routes.home}
        />
      </Switch>
    </div>
  );
};

export default observer(Router);

function PrivateRoute({ to, auth, component: Component, ...rest }) {
  return (
    <Route {...rest}>
      {auth ? <Component /> : <Redirect {...{ to }} />}
    </Route>
  );
}
