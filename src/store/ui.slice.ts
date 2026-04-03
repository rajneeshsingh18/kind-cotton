import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  bannerDismissed: boolean;
}

const initialState: UIState = {
  bannerDismissed: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    dismissBanner: (state) => {
      state.bannerDismissed = true;
    },
  },
});

export const { dismissBanner } = uiSlice.actions;

export const selectBannerDismissed = (state: { ui: UIState }) =>
  state.ui.bannerDismissed;

export default uiSlice.reducer;
