import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authslice";

const NavBar = () => {
  const dispatch = useDispatch();

  return (
    <nav className="bg-white p-4 shadow-md fixed top-0 left-0 right-0">
      {/* Make the navbar fixed */}
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-black text-2xl font-bold flex items-center" to="/">
          We
        </Link>
        <div className="space-x-4">
          <NavLink
            className="text-black hover:text-blue-500 transition duration-300"
            exact
            to="/"
            activeClassName="font-bold"
          >
            Home
          </NavLink>
          <button
            className="text-black hover:text-blue-500 cursor-pointer duration-300"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
