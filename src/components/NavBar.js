/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authslice";

import NotificationModal from "./NotificationModal";
import getNotificationsApi from "../api/getNotificationsApi";
import {
  AiTwotoneHome,
  AiFillWechat,
  AiTwotoneNotification,
} from "react-icons/ai";
import getUnseenChatsApi from "../api/getUnseenChatsApi";

const NavBar = () => {
  const [showNotify, setShowNotify] = useState(false);
  const [notification, setNotification] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotificationsApi();
        setNotification(data);

        const unseenChatsResponse = await getUnseenChatsApi(); // Implement this API function
        setUnseenChats(unseenChatsResponse);
        console.log(unseenChats, "iam chatttttttttt");
      } catch (error) {
        console.error(error);
      }
    };
    if (user && !loading) {
      fetchData();
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      const accessToken = localStorage.getItem("access_token");
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      // const socket = new WebSocket(`${websocketProtocol}${window.location.host}/ws/notification/?token=${accessToken}`);
      const socket = new WebSocket(
        `${websocketProtocol}13.49.68.219/ws/notification/?token=${accessToken}`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        console.log(newNotification);
        if (newNotification.type === "notification") {
          setNotification((prevNotifications) => [
            ...prevNotifications,
            newNotification.payload,
          ]);
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
      };
      return () => {
        socket.close();
      };
    }
  }, [user]);

  

  const removeNotification = (notificationIdToRemove) => {
    setNotification((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationIdToRemove
      )
    );
  };

  return (
    <>
      <div className="bg-white h-16 fixed top-0 left-0 w-full flex items-center justify-between px-4 border-b-2 border-gray-200 shadow-xl">
        <div className="flex items-center">
          <Link className="text-black text-2xl font-bold" to="/">
            We
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-sm font-normal">
            <AiTwotoneHome className="text-xl" />
          </NavLink>

          <NavLink to="/message" className="text-sm font-normal relative">
            <div className="flex items-center">
              <AiFillWechat className="text-2xl mr-2" />{" "}
              {/* Increase icon size */}
              {unseenChats?.count > 0 && (
                <span className="absolute -top-4 -right-2 bg-red-500 text-white px-2 py-1 rounded-full">
                  {unseenChats.count}
                </span>
              )}
            </div>
          </NavLink>
          <div className="flex items-center gap-4 py-4 border-b-2 border-gray-200">
            <button
              className="text-sm leading-5 font-normal relative"
              onClick={() => setShowNotify(true)}
            >
              <AiTwotoneNotification className="text-2xl" />{" "}
              {/* Increase icon size */}
              {notification?.length > 0 && (
                <span className="absolute -top-4 -right-2 bg-red-500 text-white px-2 py-1 rounded-full">
                  {notification?.length}
                </span>
              )}
            </button>
          </div>

          <button onClick={() => dispatch(logout())} className="text-sm font-normal">
            Logout
          </button>
        </div>
      </div>

      {showNotify && (
        <NotificationModal
          isVisible={showNotify}
          onClose={() => setShowNotify(false)}
          notification={notification}
          removeNotification={removeNotification}
        />
      )}
    </>
  );
};

export default NavBar;
