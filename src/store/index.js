import user from "./user/reducer";
import reduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reduxPromise from "redux-promise";

const reducers = combineReducers({
  user,
});

// redux 持久化配置
const persistConfig = {
  key: "xlt-user",
  storage: storage,
};

const persistReducerConfig = persistReducer(persistConfig, reducers);

// 开启 redux-devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleWares = applyMiddleware(reduxThunk, reduxPromise);

const store = createStore(persistReducerConfig, composeEnhancers(middleWares));

const persistor = persistStore(store);

export { store, persistor };
