import { createSlice } from "@reduxjs/toolkit";



export const dogSlice = createSlice({
  name: "dog",
  initialState: {
    dogs: [],
    selectedDog: null,
  },
  reducers: {
    setDogs: (state, action) => {
      state.dogs = action.payload;
    },
    setSelectedDog: (state, action) => {
      state.selectedDog = action.payload;
    },
  },
});
export const {setDogs, setSelectedDog} = dogSlice.actions;

export const dogData = (state) => state.dog;
export default dogSlice.reducer;