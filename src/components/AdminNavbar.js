import React from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logout } from "../redux/authslice";

function AdminNavbar() {
  const dispatch = useDispatch(); // Get the dispatch function

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <ul className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <li>
              <a
                href="/adm"
                className="text-white font-bold text-3xl hover:text-gray-200">
                We
              </a>
            </li>
            <li>
              <a href="/userlist" className="text-white hover:text-gray-200">
                Manage Users
              </a>
            </li>
            <li>
              <a href="/PostList" className="text-white hover:text-gray-200">
                Manage Posts
              </a>
            </li>
            <li>
              <a href="/Blockedpost" className="text-white hover:text-gray-200">
                Blocked Posts
              </a>
            </li>
            <li>
              <a
                href="/RepotedPostList"
                className="text-white hover:text-gray-200"
              >
                Reported Posts
              </a>
            </li>
          </div>
          <li>
            <a href="/" onClick={() => dispatch(logout())}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
