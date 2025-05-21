import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:null,
        userProfile:null,
        selectedUser:null,
        
       
        
    },reducers:{
        setUser(state,action){
            state.user = action.payload;
           
        },
        setSuggestedUsers(state,action){
            state.suggestedUsers = action.payload;
        },
        setUserProfile(state,action){
            state.userProfile = action.payload;
        },
        setSelectedUser(state,action){
            state.selectedUser = action.payload;
        },
        setFollowed(state, action) {
            state.userProfile.followers = [...state.userProfile.followers, action.payload];
        },
        setUnFollow(state, action) {
            state.userProfile.followers = state.userProfile.followers.filter(follower => follower !== action.payload);
        },
        setFollowing(state, action) {
            state.user.following = [...state.user.following, action.payload];
        },
        setUnFollowing(state, action) {
            state.user.following = state.user.following.filter(following => following !== action.payload);
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("persist:root"); // clear localStorage if using persist
          },
        
    }
})
export const {setUser,setSuggestedUsers,setUserProfile,setSelectedUser,setFollowed,setUnFollow,setFollowing,setUnFollowing ,logoutUser} = authSlice.actions;
export default authSlice.reducer;
