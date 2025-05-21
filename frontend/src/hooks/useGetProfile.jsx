import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile, logoutUser } from "@/redux/authSlice.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useGetProfile = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setUserProfile(response.data.user));
        } else {
          toast.error("Failed to fetch profile");
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

    if (userId) {
      fetchProfile();
    }
  }, [userId, dispatch, navigate]);
};

export default useGetProfile;
