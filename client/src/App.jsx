import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Feed from './pages/Feed';
import ChatBox from './pages/ChatBox';
import Messages from './pages/Messages';
import Connections from './pages/Connections';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import CreatePost from './components/CreatePost';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route index element={<Feed />}/>
        <Route path='messages' element={<Messages />} />
        <Route path='messages/:userId' element={<ChatBox />} />
        <Route path='connections' element={<Connections />} />
        <Route path='discover' element={<Discover />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/:profileId' element={<Profile />} />
        <Route path='create-post' element={<CreatePost />} />
      </Routes>
    </>
  )
}

export default App