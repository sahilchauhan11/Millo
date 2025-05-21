import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(state => state.auth);

  return (
    <div className='flex px-1 flex-col my-10 lg:px-4 w-full max-w-lg h-screen  mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl font-semibold text-gray-900'>Suggested Users</h1>
        <Link to="/suggested-users" className='text-blue-600 hover:underline'>View All</Link>
      </div>

     <div className='w-full h-[80%] overflow-scroll scrollbar-hide'>
       {suggestedUsers?.map((user, index) => (
        <div 
          key={index} 
          className='w-full flex items-center bg-white  shadow-md rounded-xl  p-1  sm:p-3 mb-3 hover:bg-gray-100 transition duration-200'
        >
          <div className='flex items-center justify-evenly w-full'>
            <div className='w-14 h-14 flex justify-center items-center'>
              <Link to={`/profile/${user._id}`}>
                <Avatar>
                  <AvatarImage src={user.owner?.profilePicture || ""} />
                  <AvatarFallback className='bg-gray-300 text-gray-600'>CN</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='flex flex-col ml-3 flex-1'>
              <p className=' text-[10px] md:text-lg tracking-tighter font-medium text-gray-900'>{user.username}</p>
              <button className='bg-blue-500 text-xs hover:bg-blue-600 px-1 text-white py-1 md:px-4 rounded-xl md:text-sm transition duration-200'>
              Follow
            </button>
            </div>
            
          </div>
        </div>
      ))}
     </div>
    </div>
  )
}

export default SuggestedUsers;
