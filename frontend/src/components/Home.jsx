
import RighSideBar from './RighSideBar.jsx'
import Feed from './Feed.jsx'
import useGetAllPost from '../hooks/useGetAllPost.jsx'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers.jsx'


const Home = () => {
  useGetAllPost();
useGetSuggestedUsers();


  return (
    <div className='flex h-full w-full relative justify-center overflow-hidden'>
    <div className='w-[80%] h-full'>
      {/* <div className='bg-red-500'>hoho</div> */}
      <Feed/>
    </div>
   
        <RighSideBar/>
    
    
    </div>
  )
}

export default Home
