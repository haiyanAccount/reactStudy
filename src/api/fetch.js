import axios from "axios";
import { store } from "../store/index";
import { createBrowserHistory } from "history";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const history = createBrowserHistory();

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // api的base_url
  timeout: 300000, // 请求超时时间,
  // 跨域是否带Token
  withCredentials: true,
  // 响应的数据格式 json / blob /document /arraybuffer / text / stream
  responseType: "json",
  // XSRF 设置
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (config.url !== "/admin/login" && !store.getState().user.token) {
      let errorMsg = { msg: "cancelCache" + Math.random(), data: [] };
      config.cancelToken = source.token;
      source.token.reason = errorMsg;
      source.cancel(errorMsg);
      setTimeout(() => {
        window.location.pathname = "/login";
      }, 100);
    }
    if (store.getState().user.token) {
      config.headers["encrypt"] = store.getState().user.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    // Do something with request error
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data.code == "1001001011") {
      // store.dispatch("FedLogOut");
    }
    if (response.data.code !== 1 && response.data.code !== 200) {
      return Promise.reject(response.data.msg);
    }
    return response.data;
  },
  (error) => {
    // Message({
    //   message: error.message,
    //   type: "error",
    //   duration: 5 * 1000,
    // });
    return Promise.reject(error);
  }
);

export default service;
