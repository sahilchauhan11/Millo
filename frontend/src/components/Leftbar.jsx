import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Create from './Create.jsx'
import { useSelector } from 'react-redux'

const Leftbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector((state) => state.realTimeNSlice);
  const [openleftbar, setOpenleftbar] = useState(true);

  return (
    <div className="relative w-full">
      {/* Toggle Button for Mobile */}
      <button
        className={`md:hidden fixed  z-50 p-2 bg-gray-800 text-white rounded-full  h-[40px] ${openleftbar ? ' bottom-10 left-12 w-[70px]  ' : 'top-4 left-4 w-[40px]'})`}
        onClick={() => setOpenleftbar(!openleftbar)}
      >
        <span className="material-symbols-outlined">{openleftbar ? 'close' : 'menu'}</span>
      </button>

      {openleftbar && (
        <div className="w-full min-w-[160px] h-screen absolute z-30 md:relative left-0 flex justify-center items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <div className="w-[95%] flex flex-col items-center rounded-2xl h-[95%] py-2 bg-white">
            <h1 className="text-4xl font-extrabold w-full font-serif flex justify-center items-center">
              MILLO
            </h1>
            <div className="flex flex-col items-center h-full py-5">
              <Link
                to="/"
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">home</span> home
              </Link>

              <Link
                to="/search"
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">search</span> search
              </Link>

              <Link
                to="/explore"
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">explore</span> explore
              </Link>

              <Link
                to="/chat"
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">chat</span> Chats
              </Link>

              <Link
                to="/notifications"
                className="relative bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">notifications</span> Notifications
                {likeNotification?.length > 0 && (
                  <span className="absolute top-2 right-4 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {likeNotification.length}
                  </span>
                )}
              </Link>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen(true)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setOpen(true);
                }}
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded font-serif gap-2 hover:bg-gray-200 cursor-pointer text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">add</span> Create
              </div>

              <Link
                to={`/profile/${user?._id}`}
                className="bg-transparent flex justify-start w-[90%] items-center text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded-md font-serif gap-2 hover:bg-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-black overflow-hidden text-[15px] px-1 py-4">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={
                      user?.profilePicture
                        ? user.profilePicture
                        : "/person_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
                    }
                    alt="profile"
                  />
                </div> Profile
              </Link>

              <Link
                to="/signout"
                className="bg-transparent flex justify-start w-[90%] text-gray-700 sm:text-1xl sm:p-4 font-semibold rounded font-serif gap-2 hover:bg-gray-200 text-[15px] px-1 py-4"
              >
                <span className="material-symbols-outlined">logout</span> Logout
              </Link>
            </div>

            <Create open={open} setOpen={setOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leftbar;