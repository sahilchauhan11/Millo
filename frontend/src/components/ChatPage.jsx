import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/authSlice';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import Messages from './Messages';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useGetRealTimeMessages from '@/hooks/useGetRealTimeMessages';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  useGetRealTimeMessages();

  const [textMessage, setTextMessage] = useState('');
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector((state) => state.auth);
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);
  const { messages } = useSelector((state) => state.chat);

  const handleSendMessage = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/message/send/${receiverId}`,
        { message: textMessage },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.message]));
      }
      setTextMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Sidebar - user list */}
      <section className="md:w-[30%]  w-full flex-shrink-0 overflow-y-auto bg-white shadow-md border-b md:border-b-0 md:border-r h-[20vh] md:h-full py-2 px-2 scrollbar-hide 
      md:px-0">
        <div className="hidden md:flex flex-col items-center pb-5 border-b mb-5">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage src={user?.profilePicture || ''} className="rounded-full object-cover" />
            <AvatarFallback className="h-full w-full flex items-center justify-center text-xl bg-gray-200 p-4">
              {user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-sm md:text-base font-semibold text-center">{user?.username}</h2>
        </div>

        <div className="flex md:flex-col md:items-center relative  gap-4 md:space-y-2 md:overflow-y-auto scrollbar-hide">
          {suggestedUsers?.map((sugguser) => {
            const isOnline = onlineUsers?.includes(sugguser?._id);
            return (
              <div
                key={sugguser._id}
                onClick={() => dispatch(setSelectedUser(sugguser))}
                className="flex md:flex-row flex-col items-center md:items-start gap-2 bg-[#c8b6ff] p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition-all w-[100px] md:w-[80%]"
              >
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage src={sugguser.profilePicture || ''} className="rounded-full object-cover" />
                  <AvatarFallback className="bg-gray-300">{sugguser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full items-center md:items-start">
                  <h1 className="text-xs lg:text-sm font-semibold">{sugguser.username}</h1>
                  <span
                    className={`text-[9px] md:text-xs font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat section */}
      <section className="flex flex-col bg-white shadow-md w-full md:h-full h-[80vh] md:w-[70%] relative ">
        <div className="w-full h-full flex flex-col">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 p-4 border-b h-[10vh] w-full">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage src={selectedUser.profilePicture || ''} className="rounded-full object-cover" />
                  <AvatarFallback className="bg-gray-300">{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">{selectedUser.username}</h1>
                  <Link to={`/profile/${selectedUser?._id}`} className="text-sm text-blue-500 hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto bg-gray-50 py-2 w-full md:w-full px-1">
                <Messages selectedUser={selectedUser} />
              </div>

              {/* Input */}
              <div className="flex items-center h-[10vh] p-3 border-t bg-gray-100">
                <input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(selectedUser?._id);
                    }
                  }}
                />
                <Button
                  onClick={() => handleSendMessage(selectedUser?._id)}
                  className="ml-3 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full justify-center items-center p-6 text-center">
              <MessageCircleCode className="w-20 h-20 text-gray-400 mb-4" />
              <h1 className="text-lg font-bold text-gray-700">Select a user to start chatting</h1>
              <p className="mt-2 text-gray-500">You can browse and select a user from the sidebar to chat.</p>
              <input
                disabled
                placeholder="Select a user first to type message..."
                className="mt-4 w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              />
              <Button disabled className="mt-2 px-5 py-2 bg-blue-300 text-white rounded-lg">
                Send
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
