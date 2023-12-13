import handleCount from "./index";

let reducer = (state = { ...handleCount.state }, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  for (let key in handleCount.actionsName) {
    if (action.type === handleCount.actionsName[key]) {
      handleCount.actions[handleCount.actionsName[key]](newState, action);
      break;
    }
  }
  return newState;
};

export default reducer;
