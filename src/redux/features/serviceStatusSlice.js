import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSaving: false,
  isServerError: false,
};

export const serviceStatusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setServerError: (state, action) => {
      state.isServerError = action.payload;
    },
  },
});

export const { setSaving, setServerError } = serviceStatusSlice.actions;

export default serviceStatusSlice.reducer;
