import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { BASE_URL } from '../utils/constants';

const UpdatePost = ({ postId, onCancel, fetchData, post }) => {
  // Initialize state for the caption
  const [caption, setCaption] = useState(post.caption);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a PUT request to update the post's caption
      const accessToken = localStorage.getItem('access_token');

      // Construct the request payload with the updated caption
      const requestData = {
        content: caption, // Assuming the Django view uses 'content' for the caption field
      };

      const response = await axios.put(
        `${BASE_URL}/post/update-post/${postId}/`, // Update the URL endpoint
        requestData, // Send the updated caption in the request body
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Post updated successfully
        if (fetchData) {
          fetchData();
        }
        toast.success('Successfully Updated', {
          position: 'top-center',
        });
        onCancel();
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to Update Post', {
        position: 'top-center',
      });
    }
  };

  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCancel();
    }
  };

  useEffect(() => {
    setCaption(post.caption);
  }, [post]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-y-hidden fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40">
      <div ref={modalRef} className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg mx-auto pt-20">
        <div className="flex justify-between items-center mb-2 ">
          <p className="text-xl font-semibold">Update post</p>
          <button
            className="text-white bg-red-500 p-2 rounded-3xl"
            onClick={onCancel}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Write something..."
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
