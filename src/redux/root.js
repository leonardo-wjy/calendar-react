import { combineReducers } from "@reduxjs/toolkit";
import calendarReducer from "./calendarSlice";
import toggleReducer from "./toggleSlice";

export default combineReducers({
  calendar: calendarReducer,
  toggle: toggleReducer,
});
