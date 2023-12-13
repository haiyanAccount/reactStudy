import handleArr from "./index";

let reducer = (state = { ...handleArr.state }, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  for (let key in handleArr.actionsName) {
    if (action.type === handleArr.actionsName[key]) {
      handleArr.actions[handleArr.actionsName[key]](newState, action);
      break;
    }
  }
  return newState;
};

export default reducer;
