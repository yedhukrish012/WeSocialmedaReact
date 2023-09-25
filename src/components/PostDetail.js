import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import axios from "axios"; // Correct import
import { FaTimes } from "react-icons/fa";

const PostDetail = ({ postId, onCancel }) => {
  const modalRef = useRef(); // Define modalRef at the top

  const [post, setPost] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/post/getpost/${postId}/`, {
        // Replace '50' with postId
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken, postId]); // Include postId in the dependency array

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log(post);

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white w-5/12 border rounded-lg shadow-lg p-4 relative" ref={modalRef}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src={post.author.profile_pic}
                alt="user_image"
              />
              <span className="ml-2 font-bold">{post.author.username}</span>
            </div>
            <button
              className="text-white bg-red-500 p-2 rounded-3xl"
              onClick={onCancel}
            >
              <FaTimes />
            </button>
          </div>

          <div className="relative group">
            <img
              className="rounded-lg w-full h-80 object-cover mt-2"
              src={post.img}
              alt="post_image"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold mt-2 text-center">
                {post.title}
              </h2>
              <p className="text-gray-600 text-center mb-6">{post.content}</p>
              <div className="flex items-center mt-2">
                <button className="items-center space-x-2 cursor-pointer">
                  <AiFillHeart color="red" className="w-10 h-8" />
                  <span className="text-gray-600">{post.likes_count}</span>
                </button>

                <button className="pl-4 items-center space-x-2 cursor-pointer">
                  <AiOutlineComment className="w-8 h-8" />
                  <span className="items-center pr-2 text-gray-600">
                    {post.comments.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
