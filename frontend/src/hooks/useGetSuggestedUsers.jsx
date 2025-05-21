import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setSuggestedUsers } from "@/redux/authSlice.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
const navigate=useNavigate()
  useEffect(() => {
    if (!user) return;

    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/suggestions`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setSuggestedUsers(response.data.users));
        } else {
          toast.error("Failed to fetch suggested users");
        }
      } catch(error) {
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
              } }
    };

    fetchSuggestedUsers();
  }, [user, dispatch]);
};

export default useGetSuggestedUsers;
