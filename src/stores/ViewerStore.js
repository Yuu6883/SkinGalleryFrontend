import { types as t } from 'mobx-state-tree';
import Api from 'src/api';
import { UserModel } from './models';
import { asyncModel } from './utils';

export const ViewerStore = t
  .model('ViewerStore', {
    user: t.maybeNull(UserModel),
    loginFlow: asyncModel(loginFlow),
  })
  .actions((self) => ({
    setViewer(user) {
      self.user = user;
    },
  }));

function loginFlow() {
  return async (self, parent) => {
    const { data } = await Api.Auth.login();
    parent.setViewer(data);
  };
}
