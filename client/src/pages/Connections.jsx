import React, { useState } from 'react';
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from "../assets/assets";
const Connections = () => {
  const navigate = useNavigate();
  const dataArray = [
    {label: 'Followers', value: followers, icon: Users},
    {label: 'Following', value: following, icon: UserCheck},
    {label: 'Pending', value: pendingConnections, icon: UserRoundPen},
    {label: 'Connections', value: connections, icon: UserPlus},
  ]
  const [currentTab, setCurrentTab] = useState('Followers');

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new connections.</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-md'>
          {
            dataArray.map((tab) =>(
              <button onClick={() => setCurrentTab(tab.label)} key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab == tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}>
                <tab.icon className='w-4 h-4' />
                <span className='ml-1'>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className='ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full'>{tab.count}</span>
                )}
              </button>
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Connections