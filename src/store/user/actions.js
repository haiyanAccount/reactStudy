import * as types from "../mutation-types";

// * setToken
export const setToken = (token) => ({
  type: types.SET_TOKEN,
  token,
});

export const setUserInfo = (userInfo) => ({
  type: types.SET_USER_INFO,
  userInfo,
});
