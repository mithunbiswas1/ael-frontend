// src/redux/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api-slice/api-slice";
import CartDrawerSlice from "@/redux/slice/CartDrawerSlice";
import authReducer from "@/redux/slice/authSlice";

const authResetMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (action.type === "auth/setLogout" || action.type === "auth/setLogin") {
    storeAPI.dispatch(apiSlice.util.resetApiState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cartDrawer: CartDrawerSlice,
    auth: authReducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware, authResetMiddleware),
});
