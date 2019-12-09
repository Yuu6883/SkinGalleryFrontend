import { types as t, getParent, getRoot } from 'mobx-state-tree';

export function asyncModel(thunk, auto = true) {
  const model = t
    .model(thunk.name, {
      isLoading: false,
      isError: false,
      errorMsg: t.maybeNull(t.string),
    })
    .actions((self) => ({
      start() {
        self.isLoading = true;
        self.isError = false;
        self.errorMsg = null;
      },
      success() {
        self.isLoading = false;
      },
      error(e) {
        self.isLoading = false;
        self.isError = true;
        self.errorMsg = parseError(e);
      },
      async _auto(promise) {
        try {
          self.start();

          await promise;

          self.success();
        } catch (e) {
          self.error(e);
        }
      },
      async run(...args) {
        const promise = thunk(...args)(
          self,
          getParent(self),
          getRoot(self),
        );

        if (auto) {
          return self._auto(promise);
        }

        return promise;
      },
    }));

  return t.optional(model, {});
}

function parseError(e) {
  return e.message;
}
