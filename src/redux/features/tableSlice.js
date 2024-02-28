import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
  errors: {},
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.content = action.payload;
    },
    updateTableData: (state, action) => {
      const { rowId, entry } = action.payload;
      const index = state.content.findIndex((item) => item.rowId === rowId);
      if (index !== -1) {
        state.content[index] = { ...state.content[index], ...entry };
      } else {
        state.content.push(entry);
      }
    },
    setFieldError: (state, action) => {
      const { index, field, error } = action.payload;
      if (!state.errors) {
        state.errors = {};
      }
      if (!state.errors[index]) {
        state.errors[index] = {};
      }
      state.errors[index][field] = error;
    },
  },
});

export const { setTableData, updateTableData, setFieldError } =
  tableSlice.actions;

export default tableSlice.reducer;
