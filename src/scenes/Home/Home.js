import React from 'react';
import { observer } from 'mobx-react';

const s = {
  userPanel:
    'uk-card uk-padding-small uk-margin-top uk-animation-fade card',
  grid: 'uk-grid-small uk-flex uk-flex-middle uk-margin-remove',
  username: 'uk-card-title uk-margin-remove-bottom text',
  userStatus: 'uk-text-meta uk-margin-remove-top text',
  buttonsDiv: 'uk-width-expand button-group',
  logoutBtn: 'btn danger uk-float-right',
  uploadSkinBtn: 'btn uk-margin-right uk-float-right',
};

const Home = () => {
  return (
    <div className={s.userPanel}>
      <div className={s.grid} uk-grid>
        <div className="uk-width-auto">
          <img
            className="uk-border-circle"
            width="40"
            height="40"
            alt="username"
          />
        </div>
        <div className="uk-width-auto">
          <h3 className={s.username}>username</h3>
          <p className={s.userStatus}>status?</p>
        </div>
        <div className={s.buttonsDiv}>
          <button className={s.logoutBtn}>Log out</button>
          <button className={s.uploadSkinBtn}>Upload Skin</button>
        </div>
      </div>
    </div>
  );
};

export default observer(Home);
