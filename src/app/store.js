import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import {userSlice} from '../pages/userSlice';
import userDetailSlice from "../pages/userDetailSlice";
import {dogSlice} from "../pages/dogSlice";




const reducers = combineReducers({
  user: userSlice.reducer,
  userDetails: userDetailSlice,
  dog: dogSlice.reducer
  
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});