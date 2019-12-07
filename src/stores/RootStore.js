import { types as t } from 'mobx-state-tree';
import { ViewerStore } from './ViewerStore';

export const RootStore = t.model('RootStore', {
  // entities: smth,
  viewer: t.optional(ViewerStore, {}),
});
