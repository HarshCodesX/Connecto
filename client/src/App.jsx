import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Feed from './pages/Feed';
import ChatBox from './pages/ChatBox';
import Messages from './pages/Messages';
import Connections from './pages/Connections';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import { useUser, useAuth } from '@clerk/clerk-react';
import Layout from './pages/Layout';
import {Toaster} from "react-hot-toast";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/user/userSlice.js';
import { fetchConnections } from './features/connections/connectionsSlice.js';

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  //whenever the user will change, execute this function
  useEffect(() => {
    const fetchdata = async () => {
      if(user){
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    }
    fetchdata();
  }, [user, getToken, dispatch]); //getToken added by me to dependencies to avoid warning 
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={!user ? <Login /> : <Layout />}>
        <Route index element={<Feed />}/>
        <Route path='messages' element={<Messages />} />
        <Route path='messages/:userId' element={<ChatBox />} />
        <Route path='connections' element={<Connections />} />
        <Route path='discover' element={<Discover />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/:profileId' element={<Profile />} />
        <Route path='create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App