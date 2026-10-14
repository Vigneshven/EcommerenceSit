import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import { persistReducer, persistStore } from "redux-persist";
import shopReducer from "./shopSlice";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import orderReducer from "./orderSlice";
import storage from "./webStorage";

const shopPersistConfig = {
  key: "shop",
  storage,
  whitelist: ["cart"],
};

const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["mode"],
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const ordersPersist = {
  key: "orders",
  storage,
};

const persistedReducer = persistReducer(shopPersistConfig, shopReducer);

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const persistedOrderReducer = persistReducer(ordersPersist, orderReducer);

const rootReducer = combineReducers({
  filters: filterReducer,
  shop: persistedReducer,
  theme: persistedThemeReducer,
  auth: persistedAuthReducer,
  orders: persistedOrderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
