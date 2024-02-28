import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { tableSlice } from "./features/tableSlice";
import { tableApi } from "./services/tableEntries";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { serviceStatusSlice } from "./features/serviceStatusSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["table"], 
};

const rootReducer = combineReducers({
  table: tableSlice.reducer,
  status: serviceStatusSlice.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["tableApi"],
        ignoredActionPaths: ["payload.birthday"],
        ignoredActionPaths: ["meta.baseQueryMeta.request"],
      },
    }).concat(tableApi.middleware),
});

export const persistor = persistStore(store);
