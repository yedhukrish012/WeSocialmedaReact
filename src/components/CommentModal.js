import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import createCommentApi from "../api/createCommentApi";
import Axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineSend } from "react-icons/ai";
import CommentDeleteApi from "../api/CommentDeleteApi";

const CommentModal = ({ isOpen, onRequestClose, postId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    Axios.get(`${BASE_URL}/post/comments/${postId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postId) {
      try {
        await createCommentApi(postId, newComment);
        setTrigger(false);
        toast.success("Successfully Created", {
          position: "top-center",
        });
        setNewComment("");
      } catch (error) {
        toast.error("Failed to Create Post", {
          position: "top-center",
        });
      }
    }
  };

  const handleDeleteComment = async (postId) => {
    try {
      await CommentDeleteApi(postId);
      toast.success("comment Deleted Successfully!", {
        position: "top-center",
      });
      setTrigger(false);
    } catch (error) {
      toast.error("Comment Not Deleted!", {
        position: "top-center",
      });
    }
  };

  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onRequestClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isOpen && (
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-700 bg-opacity-60 overflow-y-auto">
  <div
    ref={modalRef}
    className="bg-white w-1/2 p-4 rounded-lg shadow-lg mx-auto overflow-y-auto animate-slide-up"
  >
    <div className="flex justify-between items-center mb-4">
      <p className="text-3xl font-bold text-blue-900">Add Comment</p>
      <button
        className="text-gray-600 hover:text-red-500 p-2 rounded-full focus:outline-none focus:ring"
        onClick={onRequestClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div className="overflow-y-auto mb-4 max-h-80">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="mb-4 flex items-center relative group p-2 bg-gray-100 rounded-lg"
          onMouseEnter={() => setHoveredCommentId(comment.id)}
          onMouseLeave={() => setHoveredCommentId(null)}
        >
          <img
            src={`${BASE_URL}${comment.user.profile_pic}`}
            alt={comment.user.username}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-blue-900 text-lg">
              {comment.user.username}
            </p>
            <p className="text-gray-700">{comment.content}</p>
          </div>

          {hoveredCommentId === comment.id &&
            comment.user.id === user.id && (
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => {
                  handleDeleteComment(comment.id);
                  setTrigger(true);
                }}
              >
                <RiDeleteBin6Line />
              </button>
            )}
        </div>
      ))}
    </div>

    <form
      onSubmit={(e) => {
        handleSubmit(e);
        setTrigger(true);
      }}
      className="flex-grow flex items-end"
    >
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="h-20 w-full p-4 border rounded-lg resize-none focus:ring focus:ring-blue-400 text-gray-700"
        placeholder="Write a comment..."
        rows="4"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full focus:ring focus:ring-blue-400 ml-4"
      >
        <AiOutlineSend className="w-8 h-8" />
      </button>
    </form>
  </div>
</div>



    )
  );
};

export default CommentModal;
