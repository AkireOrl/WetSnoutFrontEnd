import { createSlice } from "@reduxjs/toolkit";



export const dogSlice = createSlice({
  name: "dog",
  initialState: {
    dogs: [],
  },
  reducers: {
    setDogs: (state, action) => {
      state.dogs = action.payload;
    },
  },
});

export const { setDogs } = dogSlice.actions;
export const dogData = (state) => state.dog;
export default dogSlice.reducer;