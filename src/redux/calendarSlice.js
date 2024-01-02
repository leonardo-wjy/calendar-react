import { createSlice } from "@reduxjs/toolkit";

export const calendarReducer = createSlice({
  name: "calendar",
  initialState: "",
  reducers: {
    setCalendar: (state, action) => (action.payload.calendar)
  }
});

export const { setCalendar } = calendarReducer.actions;

export default calendarReducer.reducer;
