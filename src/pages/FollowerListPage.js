import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import Layout from '../components/Layout';
import FollowUnfollowApi from '../api/FollowUnfollowApi';

const FollowerListPage = () => {
  const [trigger, setTrigger] = useState(false);
  const accessToken = localStorage.getItem('access_token');
  const [followers, setFollowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if the user object exists before making the request
    if (isAuthenticated && user) {
      axios
        .get(`${BASE_URL}/post/followers/${user.id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setFollowers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching followers:', error);
        });
    }
  }, [accessToken, isAuthenticated, user, trigger]);

  const handleFollowUnfollow = async (userId) => {
    try {
      await FollowUnfollowApi(userId);
      setTrigger(!trigger); // Toggle trigger to trigger a re-render
    } catch {
      console.log('follow/unfollow got an error');
    }
  };

  const filteredUsers = followers.filter((follower) =>
    follower.follower.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout title="Followers" content="Your followers list">
      <div className="p-24">
        <h1 className="text-3xl font-semibold text-center mb-4">Followers</h1>
        <div className="flex justify-center items-center mb-7">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-black placeholder-gray-900 dark:bg-navy-700 dark:text-white dark:placeholder-gray-800 px-4 py-2 pb-2"
          />
        </div>
        <div className="bg-slate-400 shadow-md  rounded-md overflow-x-auto">
          <table className="min-w-full p-7 border-y-cyan-950">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Profile Picture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((follower) => (
                <tr key={follower.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img
                        src={follower.follower.profile_pic}
                        alt={`${follower.follower.username}'s profile`}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <h2 className="text-lg font-semibold">{follower.follower.username}</h2>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {formatDate(follower.follower.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        handleFollowUnfollow(follower.follower.id);
                      }}
                      className={`bg-green-900 hover:bg-green-950 text-white font-bold py-1 px-2 rounded ${
                        follower.is_following_follower ? 'bg-green-900 hover:bg-green-950' : ''
                      }`}
                    >
                      {follower.is_following_follower ? 'Following' : 'Follow Back'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default FollowerListPage;
