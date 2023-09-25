import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar";

const BlockedPostList = () => {
const [Bposts, setBPosts] = useState([]);
const [trigger, setTrigger] = useState(false);
const accessToken = localStorage.getItem("access_token");

useEffect(() => {
  Axios.get(`${BASE_URL}/blockedposts/`, {
      headers: {
      Authorization: `Bearer ${accessToken}`,
      },
  })
      .then((response) => {
      setBPosts(response.data);
      })
      .catch((error) => {
      console.error(error);
      });
}, [accessToken,trigger]);

const handleBlockPost = async (id, isBlocked) => {
  const accessToken = localStorage.getItem('access_token');
  try {
      const response = await fetch(`${BASE_URL}/blockpost/${id}/`, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
          },
      });
      if (response.status === 200) {
          setBPosts((prevBposts) =>
              prevBposts.map((post) =>
                  post.id === id ? { ...post, is_blocked: !isBlocked } : post
              )
          );
          const actionMessage = isBlocked ? 'Unblocked a Post' : 'Blocked a Post';
          toast.success(actionMessage, {
              position: 'top-center',
          });
          setTrigger(false)
      } else {
          console.error('Failed to block/unblock post');
      }
  } catch (error) {
      console.error('Error blocking/unblocking post:', error);
  }
};



  return (
    <>
    <AdminNavbar />
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-white to-violet-400 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Blocked Posts List</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Bposts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-no-wrap">{post.id}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {post.author.username}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">{post.content}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <div className="w-24 h-24">
                    <img
                      src={post.img}
                      alt={`Post by ${post.author.username}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <button
                    className={`${
                      post.is_blocked
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white py-1 px-2 rounded-full`}
                    onClick={() => {
                      handleBlockPost(post.id, post.is_blocked);
                      setTrigger(true); 
                    }}
                  >
                    {post.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
  )
}

export default BlockedPostList
