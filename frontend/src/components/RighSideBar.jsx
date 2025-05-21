import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers.jsx'

const RightSideBar = () => {
  const { user } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`h-full md:relative absolute right-0 cursor-pointer bg-[ #f0ead2] scrollbar-hide py-4
      w-[20vw] min-w-[150px] transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    {isOpen&&  <button 
        onClick={toggleSidebar}
        className="absolute right-0 top-4 bg-gray-800 w-[40px] h-[40px] text-white p-2 rounded-full hover:bg-gray-700 transition-colors flex justify-center items-center text-xl "
      >
        { '→'}
      </button>}
     {!isOpen&& <button 
        onClick={toggleSidebar}
        className="absolute -left-10 top-4 bg-gray-800 w-[40px] h-[40px] text-white p-2 rounded-full hover:bg-gray-700 transition-colors flex justify-center items-center text-xl "
      >
        {'←'}
      </button>}
      {isOpen && (
        <div className='flex items-center w-full justify-evenly'>
          <div className='w-[20%] flex justify-center items-center'>
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  CN
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div className='flex flex-col w-[70%] items-start justify-center'>
            <p className='text-xs sm:text-sm font-bold'>{user?.username}</p>
            <p className='text-sm text-gray-500'>{user?.bio ? user.bio : "bio here..."}</p>
          </div>
        </div>
      )}
      {isOpen && <SuggestedUsers />}
    </div>
  )
}

export default RightSideBar