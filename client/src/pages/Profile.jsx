import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { dummyPostsData, dummyUserData } from '../assets/assets';
import Loading from '../components/loading';

const Profile = () => {
  const {profileId} = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'about', 'connections', etc.
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  }

  useEffect(() => {
    fetchUser();
  }, [])
  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>

        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Image */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt="cover-image" className='w-full h-full object-cover' />}
          </div>

          {/* User Info */} 
        </div>
      </div>
    </div>
  ) : (<Loading/>)
}

export default Profile;