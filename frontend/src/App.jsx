import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'


import Home from './components/Home.jsx'
import Signup from './components/signup.jsx'
import Login from './components/login.jsx'
import Create from './components/Create.jsx'
import ChatPage from './components/ChatPage.jsx'
import Explore from './components/Explore.jsx'
import EditProfile from './components/EditProfile.jsx'
import Notifications from './components/Notifications.jsx'
import Search from './components/Search.jsx'
import Signout from './components/Signout.jsx'
import Profile from './components/Profile.jsx'
import MainLayout from './components/mainLay.jsx'
import ProtectedRoute from './components/ProtectedRoute'

import { setSocket } from './redux/socketSlice.js'
import { setOnlineUsers } from './redux/chatSlice.js'
import { setLikeNotification } from './redux/realTimeNSlice.js'
import { logoutUser } from './redux/authSlice'
import {store} from './redux/store'
import "./App.css"

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { socket } = useSelector((state) => state.socketio)

  // Axios interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "Token expired"
      ) {
        store.dispatch(logoutUser())
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  )

  // Setup socket.io connection
  useEffect(() => {
    if (user) {
     
const socketio = io(import.meta.env.VITE_BACKEND_URI
  , {
  query: { userId: user._id },
  transports: ['websocket']
})

      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  // Routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        { path: '/', element: <Home /> },
        { path: '/create', element: <Create /> },
        { path: '/profile/:id', element: <Profile /> },
        { path: '/account/edit', element: <EditProfile /> },
        { path: '/explore', element: <Explore /> },
        { path: '/chat', element: <ChatPage /> },
        { path: '/notifications', element: <Notifications /> },
        { path: '/search', element: <Search /> }
      ]
    },
    { path: '/signup', element: <Signup /> },
    { path: '/signout', element: <Signout /> },
    { path: '/login', element: <Login /> }
  ])

  return <RouterProvider router={router} />
}

export default App
