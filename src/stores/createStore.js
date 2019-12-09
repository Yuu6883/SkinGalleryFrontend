import { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

export function createStore() {
  const root = RootStore.create();

  return root;
}

const MSTContext = createContext(null);

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider;

export function useStore(mapStateToProps) {
  const store = useContext(MSTContext);

  if (typeof mapStateToProps === 'function') {
    return mapStateToProps(store);
  }

  return store;
}
