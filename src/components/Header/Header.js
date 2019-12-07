import React from 'react';

const Header = () => (
  <div className="uk-text-center">
    <h1 className="uk-heading uk-margin-top text">
      Skin Gallery{' '}
      <span
        className="theme-color info"
        uk-icon="icon:info;ratio:1.5"
      />
      <div
        className="uk-card uk-card-body card"
        uk-dropdown="pos: top-center"
      >
        <h5 className="text uk-margin-remove">
          Copyright &copy; 2019 Yuu & Luka
        </h5>
      </div>
    </h1>
  </div>
);

export default Header;
