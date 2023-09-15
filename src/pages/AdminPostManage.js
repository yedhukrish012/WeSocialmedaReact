import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar";

const AdminPostManage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    Axios.get(`${BASE_URL}/listpost/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken]);

  const handleBlockPost = async (id, isBlocked) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${BASE_URL}/blockpost/${id}/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        // Update the post's is_blocked property based on the action
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id ? { ...post, is_blocked: !isBlocked } : post
          )
        );
        // Display a toast notification with the action message
        const actionMessage = isBlocked ? "Unblocked a Post" : "Blocked a Post";
        toast.success(actionMessage, {
          position: "top-center",
        });
      } else {
        console.error("Failed to block/unblock post");
      }
    } catch (error) {
      console.error("Error blocking/unblocking post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const title = post.content || ""; 
    const authorUsername = post.author?.username ||""; 
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-violet-400 via-white to-violet-400  py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Posts List</h1>
        <div className="flex justify-center items-center mb-7">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-black placeholder-gray-800 dark:bg-navy-700 dark:text-white dark:placeholder-gray-700 px-4 py-2 pb-2"
              style={{ "::placeholder": { color: "black" } }}
            />
          </div>
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
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
               {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-no-wrap">{post.id}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {post.author.username}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    {post.content}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="w-24 h-24">
                      <img
                        src={`${BASE_URL}${post.img}`}
                        alt={`Post by ${post.author.username}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <button
                      className={`${
                        post.is_blocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white py-1 px-2 rounded-full`}
                      onClick={() => handleBlockPost(post.id, post.is_blocked)}
                    >
                      {post.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPostManage;
