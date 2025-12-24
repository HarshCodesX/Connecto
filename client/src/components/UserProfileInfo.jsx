import React from 'react'

const UserProfileInfo = ({user, posts, profileId, setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 md:px-8 bg-white'>
        <div className='flex flex-col md:flex-row items-start gap-6'>
            <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'></div>
        </div>
    </div>
  )
}

export default UserProfileInfo