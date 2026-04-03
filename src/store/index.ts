import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme.slice";
import uiReducer from "./ui.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
