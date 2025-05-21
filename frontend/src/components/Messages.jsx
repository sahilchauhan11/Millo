import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useGetAllMessages from '../hooks/useGetAllMessages';
import useGetRealTimeMessages from '@/hooks/useGetRealTimeMessages';

const Messages = ({ selectedUser }) => {
  useGetRealTimeMessages();
  useGetAllMessages();

  const { messages } = useSelector((state) => state.chat);
  const messRef=useRef(null);
  
  const { user } = useSelector((state) => state.auth);
useEffect(() => {
  messRef.current.scrollIntoView();

  return () => {
    
  }
}, [messages])

  return (
    <div className="overflow-y-auto scrollbar-hide h-[90%] w-full bg-[#fdfcdc] p-4 flex flex-col gap-2 ">
      {messages && messages.map((item) => {
        const isFromSelectedUser = item?.senderId === selectedUser?._id;
        return (
         <div key={item?._id}  className={ `w-full flex
         ${isFromSelectedUser ? ' justify-start' : 'justify-end'}`}>
           <div
            
            className={`flex flex-col justify-center  p-2 text-black  ${
              isFromSelectedUser ? 'items-start bg-gray-300 rounded-t-xl rounded-r-xl' : 'items-end rounded-l-xl rounded-t-xl bg-gray-300'
            }`}
          >
            {item?.content}
          </div>
         </div>
        );
      })}
            <div ref={messRef} />
    </div>
  );
};

export default Messages;
