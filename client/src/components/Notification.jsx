import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Notification = ({t, message}) => {

    const navigate = useNavigate();

    const from =
        typeof message.from_user_id === 'string'
            ? { _id: message.from_user_id }
            : message.from_user_id || {};

    const displayName = from.full_name || 'New message';
    const avatar = from.profile_picture || '';
    const targetId = from._id || message.from_user_id;

  return (
    <div className={`max-w-md w-full bg-white shadow-lg rounded-lg flex border border-gray-300 hover:scale-105 transition`}>
        <div className='flex-1 p-4'>
            <div className='flex items-center'>
                {avatar && (
                    <img src={avatar} className='h-10 w-10 rounded-full flex-shrink-0 mt-0.5' alt="profile-image" />
                )}
                <div className='ml-3 flex-1'>
                    <p className='text-sm font-medium text-gray-900'>{displayName}</p>
                    <p className='text-sm text-gray-500'>{message.text.slice(0, 50)}</p>
                </div>
            </div>
        </div>
        
        <div className='flex border-l border-gray-200'>
            <button className='p-4 text-indigo-600 font-semibold cursor-pointer' onClick={() => {
                if (targetId) {
                    navigate(`/messages/${targetId}`);
                }
                toast.dismiss(t.id);
            }}>Reply</button>
        </div>
    </div>
  )
}

export default Notification