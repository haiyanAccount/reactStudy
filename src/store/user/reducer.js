import { produce } from "immer";
import * as types from "@/store/mutation-types";

const userState = {
  token: "",
  userInfo: {},
};

// user reducer
const user = (state = userState, action) =>
  produce(state, (draftState) => {
    switch (action.type) {
      case types.SET_TOKEN:
        draftState.token = action.token;
        break;
      case types.SET_USER_INFO:
        draftState.userInfo = action.userInfo;
        break;
      default:
        return draftState;
    }
  });

export default user;
