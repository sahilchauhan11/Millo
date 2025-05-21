import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  onlineUsers: [],
  // other state properties...
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Prevent duplicate messages
      const messageExists = state.messages.some(
        message => message._id === action.payload._id
      );
      
      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    // other reducers...
  },
});

export const { setMessages, addMessage, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;