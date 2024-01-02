import { createSlice } from "@reduxjs/toolkit";

export const toggleReducer = createSlice({
  name: "toggle",
  initialState: {
    sidebarShow: true,
    asideShow: false,
    theme: "default",
    // language
    language: "EN",
  },
  reducers: {
    setToggle: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setToggle } = toggleReducer.actions;

export default toggleReducer.reducer;
