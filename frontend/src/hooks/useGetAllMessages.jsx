import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice.js";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.message));
        } else {
          toast.error("Failed to fetch messages");
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        const status = error?.response?.status;

        if (
          msg === "Token expired" ||
          msg === "Invalid token" ||
          msg === "Token missing" ||
          status === 401 ||
          status === 403
        ) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else {
          toast.error("Error fetching messages");
        }
      }
    };

    const handleLogout = () => {
      dispatch(setUser(null));
      navigate("/login");
    };

    fetchAllMessages();
  }, [selectedUser, dispatch, navigate]);
};

export default useGetAllMessages;
