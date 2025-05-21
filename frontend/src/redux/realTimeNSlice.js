import { createSlice } from "@reduxjs/toolkit";

const realTimeNotificationSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const { type, userId } = action.payload;

      if (type === "like") {
        // Avoid duplicates maybe? (optional)
        const exists = state.likeNotification.some(notif => notif.userId === userId);
        if (!exists) state.likeNotification.push(action.payload);
      } 
      else if (type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (notification) => notification.userId !== userId
        );
      }
    },
  },
});

export default realTimeNotificationSlice.reducer;
export const { setLikeNotification } = realTimeNotificationSlice.actions;
