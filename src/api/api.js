import axios from 'axios';

const urls = {
  login: 'api/login',
};

export const Auth = {
  get autoLogin() {
    return window.localStorage.autoLogin;
  },

  set autoLogin(value) {
    window.localStorage.autoLogin = value;
  },

  discordLogin() {
    window.location.pathname = urls.login;
  },

  login: () => axios.post(urls.login),
};
