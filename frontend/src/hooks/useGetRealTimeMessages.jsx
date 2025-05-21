import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "@/redux/chatSlice.js";

const useGetRealTimeMessages = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketio);
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  
  // Handle receiving messages
  useEffect(() => {
    if (!socket || !user) return;
    
    const handleNewMessage = (message) => {
     
      
      // Check if this message belongs to the current conversation
      if (
        selectedUser && 
        ((message.senderId === selectedUser._id && message.receiverId === user._id) ||
         (message.senderId === user._id && message.receiverId === selectedUser._id))
      ) {
        // Check if we already have this message (prevent duplicates)
        const messageExists = messages.some(m => 
          m._id === message._id || 
          (m.content === message.content && 
           m.senderId === message.senderId && 
           m.createdAt === message.createdAt)
        );
        
        if (!messageExists) {
          dispatch(addMessage(message));
        } else {
          console.log("Ignored duplicate message:", message);
        }
      }
    };
    
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch, socket, user, selectedUser, messages]);

  return null;
};

export default useGetRealTimeMessages;