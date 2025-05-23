import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from './postSlice.js';
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import realTimeNSlice from "./realTimeNSlice.js";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// ⚠️ Exclude non-serializable slices like socket from persistence
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['socketio'], // do NOT persist socket
};

// 👇 Combine all slices into a root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNSlice: realTimeNSlice,
});

// 👇 Apply persistence only to parts not blacklisted
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create and export store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist & socket actions and paths
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'socketio/setSocket', // 👈 ignore this custom action
        ],
        ignoredPaths: ['socketio.socket'], 
      },
    }),
});

export const persistor = persistStore(store);
