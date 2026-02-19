import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const {user} = useUser();
  const {getToken} = useAuth();

  const upsertIncomingMessage = (incoming) => {
    setMessages((prev) => {
      const from = incoming.from_user_id;
      const senderId = typeof from === 'string' ? from : from?._id;
      if (!senderId) return prev;

      // Normalize shape so the UI can rely on populated user fields when available
      const normalized = {
        ...incoming,
        from_user_id:
          typeof from === 'string'
            ? prev.find((m) => m.from_user_id?._id === senderId)?.from_user_id || { _id: senderId }
            : from,
        // Track unseen count locally for instant updates (fallback to 1 badge behavior)
        _unseenCount: incoming.seen ? 0 : 1,
      };

      const existingIndex = prev.findIndex((m) => m.from_user_id?._id === senderId);
      let next = [...prev];
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const existingCount = Number(existing._unseenCount || (!existing.seen ? 1 : 0));
        const add = incoming.seen ? 0 : 1;
        next[existingIndex] = {
          ...existing,
          ...normalized,
          _unseenCount: existingCount + add,
        };
      } else {
        next.unshift(normalized);
      }

      // Sort latest first
      next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return next;
    });
  };

  const fetchRecentMessage = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get('/api/user/recent-messages', {
        headers: {Authorization: `Bearer ${token}`}
      });
      if(data.success){
        // Group messagesby sender and get the latest message for each sender
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id?._id || message.from_user_id;
          if(!senderId) return acc;

          if(!acc[senderId]){
            acc[senderId] = { latest: message, unseenCount: 0 };
          }

          if (new Date(message.createdAt) > new Date(acc[senderId].latest.createdAt)) {
            acc[senderId].latest = message;
          }

          if (!message.seen) {
            acc[senderId].unseenCount += 1;
          }

          return acc;
        }, {});

        // Sort messages by date
        const sortedMessages = Object.values(groupedMessages)
          .map(({ latest, unseenCount }) => ({ ...latest, _unseenCount: unseenCount }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sortedMessages);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(user){
      fetchRecentMessage();
      const interval = setInterval(fetchRecentMessage, 30000); // Fetch recent messages every 30 seconds
      return () => {clearInterval(interval)} // Clear Interval on component unmount
    }
  }, [user, getToken]); //getToken added by me to dependencies to avoid warning

  useEffect(() => {
    const handler = (e) => {
      upsertIncomingMessage(e.detail);
    };
    window.addEventListener('connecto:new_message', handler);
    return () => window.removeEventListener('connecto:new_message', handler);
  }, []);

  return (
    <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
      <h3 className='font-semibold text-slate-8 mb-4'>Recent Messages</h3>
      <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
        {
          messages.map((message, index) => (
            <Link to={`/messages/${message.from_user_id._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                <img src={message.from_user_id.profile_picture} className='w-8 h-8 rounded-full' alt="user-who-sent-msg-img" />
                <div className='w-full'>
                  <div className='flex justify-between'>
                    <p className='font-medium'>{message.from_user_id.full_name}</p>
                    <p className='text-[10px] text-slate-400'>{moment(message.createdAt).fromNow()}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-gray-500'>{message.text ? message.text : "Media"}</p>
                    {(message._unseenCount || (!message.seen ? 1 : 0)) > 0 && (
                      <p className='bg-indigo-500 text-white min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-[10px]'>
                        {message._unseenCount || 1}
                      </p>
                    )}
                  </div>
                </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default RecentMessages