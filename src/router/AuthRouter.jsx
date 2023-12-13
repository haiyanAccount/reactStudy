import { Navigate, useLocation } from "react-router-dom";
import { store } from "../store/index";
import { searchRoute } from "../utils/index";
import { rootRouter } from "./index";

const AuthRouter = (props) => {
  const { pathname } = useLocation();
  const route = searchRoute(pathname, rootRouter);
  // * 判断当前路由是否需要访问权限(不需要权限直接放行)
  if (route.meta && !route.meta.requiresAuth) return props.children;

  const token = store.getState().user.token;
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
};

export default AuthRouter;
