import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets';
import Loading from '../components/Loading';

const Feed = () => {
  const [feeds, setfeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setfeeds(dummyPostsData);
  }
  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* Stories and post list */}
      <div>
        <h1>Stories here</h1>
        <div>
          list of posts
        </div>
      </div>

      {/* right sidebar */}
      <div>

      </div>
    </div>
  ) : <Loading/>
}

export default Feed