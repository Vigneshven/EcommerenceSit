import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice"
import { persistReducer, persistStore } from "redux-persist";
import shopReducer from "./shopSlice"
import themeReducer from "./themeSlice"
import authReducer from "./authSlice"
import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default ?? storageModule;

const shopPersistConfig = {
    key: "shop",
    storage,
    whitelist: ["cart"]
}

const themePersistConfig = {
    key: "theme",
    storage,
    Whitelist:["mode"]
}

const persistedReducer = persistReducer(
    shopPersistConfig,
    shopReducer
)

const persistedThemeReducer = persistReducer(
    themePersistConfig,
    themeReducer
)

const rootReducer = combineReducers({
    filters: filterReducer,
    shop: persistedReducer,
    theme: persistedThemeReducer,
    auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,

        })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
