/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import AdminNavbar from "../components/AdminNavbar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    Axios.get(`${BASE_URL}/listusers/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setUsers(response.data);
        console.log(users.total_posts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const BlockUnblockUser = async (id) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${BASE_URL}/action/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: !user.is_active } : user
          )
        );
  
        
        const toastMessage = users.find((user) => user.id === id).is_active
          ? "Blocked a User"
          : "Unblocked a User";
        toast.success(toastMessage, {
          position: "top-center",
        });
      } else {
        console.error("Failed to block/unblock user");
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };
  
  
  return (
    <>
      <AdminNavbar />
      <div className="vh-100 gradient-custom bg-gradient-to-br from-violet-400 via-white to-violet-400">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-6">User's List</h1>
          </div>
          <div className="flex justify-center items-center mb-7">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-2/4 rounded-full bg-white border-gray-300 shadow-md text-sm font-medium text-black placeholder-gray-900 dark:bg-navy-700 dark:text-white dark:placeholder-gray-800 px-4 py-2 pb-2"
            />
          </div>
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Total Posts
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.username} {user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {user.total_posts}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {formatDate(user.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      <button
                        className={`${
                          user.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white py-1 px-2 rounded-md font-bold`}
                        onClick={() => BlockUnblockUser(user.id)}
                      >
                        {user.is_active ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
