const store = {
  state: {
    arr: [1, 3, 5, 7, 9],
  },

  actions: {
    arrPush(newState, action) {
      newState.arr.push(action.val);
    },
  },

  asyncAction: {},
  actionsName: {},
};

let actionsName = {};
for (let key in store.actions) {
  actionsName[key] = key;
}

store.actionsName = actionsName;

export default store;
