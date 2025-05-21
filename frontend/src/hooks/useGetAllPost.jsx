import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPost, setSelectedPost } from "@/redux/postSlice.js";
import { toast } from "sonner";
import { logoutUser, setUser } from "@/redux/authSlice";
import { setOnlineUsers } from "@/redux/chatSlice";
import { setSocket } from "@/redux/socketSlice";
import { useNavigate } from "react-router-dom";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(setPost([]));
    dispatch(setOnlineUsers([]));
    dispatch(setSocket(null));
    dispatch(setSelectedPost(null));
    localStorage.removeItem("persist:root");
    navigate("/login");
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/allPost`,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Posts fetched successfully");
          dispatch(setPost(response.data.post));
        } else {
          toast.error("Failed to fetch posts");
          handleLogout();
        }
      } catch (error) {
         const status = error.response?.status;
                const message = error.response?.data?.message;
        
                if (status === 401) {
                  if (message === "Token expired") {
                    toast.error("Session expired. Please log in again.");
                  } else if (message === "Invalid token") {
                    toast.error("Invalid token. Please log in again.");
                  } else if (message === "No token found") {
                    toast.error("Authentication required. Please log in.");
                  } else {
                    toast.error("Authentication error. Please log in.");
                  }
                  dispatch(logoutUser());
                  navigate("/login");
                } else {
                  toast.error("Error fetching profile");
                  console.error(error);
                }
      }
    };

    fetchAllPosts();
  }, [dispatch, navigate]);
};

export default useGetAllPost;
