import React from 'react';
import Icon from 'src/icons';
import Api from 'src/api';
import { observer } from 'mobx-react';

const s = {
  loginPanel:
    'uk-card uk-card-body uk-text-center uk-margin-top uk-animation-fade card',
  heading: 'uk-heading text',
  main: 'uk-text-center uk-margin-top-small',
  button: 'btn uk-text-center uk-width-small',
};

const Auth = () => {
  const auto = Api.Auth.autoLogin;

  const login = () => {
    Api.Auth.autoLogin = true;
    Api.Auth.discordLogin();
  };

  return (
    <div className={s.loginPanel}>
      <h4 className={s.heading}>
        Connect with Discord to use and manage skins.
      </h4>
      <div className={s.main}>
        <button
          className={s.button}
          onClick={login}
          disabled={!!auto}
        >
          <Icon name="discord" width="30" fill="white" />
          <span className="text"> Continue</span>
        </button>
      </div>
    </div>
  );
};

export default observer(Auth);
