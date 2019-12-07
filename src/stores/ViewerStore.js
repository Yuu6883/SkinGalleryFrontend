import { types as t } from 'mobx-state-tree';

export const ViewerStore = t.model('ViewerStore', {
  user: t.maybeNull(UserModel),
});

/*
  maybe parse and bannedUntil, createdAt be t.Date?
*/

const UserModel = t.model('UserModel', {
  id: t.identifier,
  username: t.string,
  discriminator: t.string,
  avatar: t.string,
  moderator: t.boolean,
  favorites: t.array(t.string),
  bannedUntil: t.number, // maybe doesn't exist?
});

const SkinModel = t.model('SkinModel', {
  skinID: t.identifier,
  status: t.string,
  skinName: t.string,
  public: t.boolean,
  tags: t.array(t.string),
  createdAt: t.number,
});
