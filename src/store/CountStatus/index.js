const store = {
  state: {
    count: 12,
  },
  actions: {
    add1(newState) {
      newState.count++;
    },
    add2(newState, action) {
      newState.count += action.val;
    },
  },

  asyncActions: {
    asyncAdd(dispatch) {
      setTimeout(() => {
        dispatch({
          type: "add1",
        });
      }, 1000);
    },
  },

  actionsName: {},
};

let actionsName = {};
for (let key in store.store.actions) {
  actionsName[key] = key;
}

store.actionsName = actionsName;

export default store;
