import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';

const FollowingListPage = () => {
  const accessToken = localStorage.getItem('access_token');
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      axios
        .get(`${BASE_URL}/post/followings/${user.id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setFollowing(response.data);
        })
        .catch((error) => {
          console.error('Error fetching following:', error);
        });
    }
  }, [accessToken, isAuthenticated, user]);

  // Filter following based on search query
  const filteredFollowing = following.filter((followingUser) =>
    followingUser.following.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Followings" content="Your followings list">
      <div className="pt-20 flex justify-center items-center">
        <div className="p-4 w-full max-w-3xl">
          <h1 className="text-3xl font-semibold text-center mb-4">Following</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white border-gray-300 shadow-md focus:ring focus:ring-blue-300"
            />
          </div>
          <table className="w-full border-collapse bg-slate-500 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-4 px-6 text-left border-b border-gray-300">Username</th>
                <th className="py-4 px-6 text-left border-b border-gray-300">Profile Picture</th>
                <th className="py-4 px-6 text-left border-b border-gray-300">Last Login Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredFollowing.map((followingUser) => (
                <tr key={followingUser.id} className="border-t">
                  <td className="py-3 px-6 border-b border-gray-300">
                    {followingUser.following.username}
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    <img
                      src={followingUser.following.profile_pic}
                      alt={`${followingUser.following.username}'s profile`}
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="py-3 px-6 border-b border-gray-300">
                    {new Date(followingUser.following.last_login).toLocaleDateString()}
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

export default FollowingListPage;
