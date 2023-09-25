import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import Axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import PostDetail from "../components/PostDetail";
import { BiEdit } from "react-icons/bi";
import { RiImageAddFill, RiFolderUploadLine } from "react-icons/ri";

const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const [PostDetailOpen, setPostDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  

  useEffect(() => {
    Axios.get(`${BASE_URL}/post/`, {
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

  const openPostDetailModal = (postId) => {
    setSelectedPostId(postId);
    setPostDetailOpen(true);
  };

  // Function to close the CommentModal
  const closeCommentModal = () => {
    setPostDetailOpen(false);
  };


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_pic", selectedFile);

    Axios.put(`${BASE_URL}/update-profile-pic/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        setMessage(response.data.message);
        // Clear the selected file and exit update mode
        setSelectedFile(null);
        setUpdateMode(false);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Something went wrong while updating the profile picture.");
      });
  };

  const handleCancelUpdate = () => {
    setUpdateMode(false);
  };


  return (
    <Layout
      title="user profile"
      content="Welcome to our social media user profile"
    >
      <>
        <div className="container mx-auto p-8">
          <div className="flex ">
          {user && (
              <div className="flex-shrink-0 pt-16 text-center">
                <img
                  className="w-40 h-40 rounded-full mb-4"
                  onClick={handleCancelUpdate}
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : `${BASE_URL}${user.profile_pic}`
                  }
                  alt="user_image"
                />
                {updateMode ? (
                  <>
                    <div className="flex items-center">
                      {" "}
                      {/* Added a flex container */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        className="border border-gray-300 p-2 rounded-md ml-2 focus:outline-none focus:ring-green-500 hover:border-green-500"
                        onClick={() =>
                          document.querySelector('input[type="file"]').click()
                        }
                      >
                        <RiImageAddFill className="w-6 h-6" />
                      </button>
                      <button
                      
                        className="btn bg-slate-500 hover:bg-slate-700 text-white ml-2 px-4 py-2 rounded-md shadow-md"
                        onClick={handleSubmit}
                        
                      >
                        <RiFolderUploadLine />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="btn border-transparent flex pl-10 hover:text-green-500"
                    onClick={() => setUpdateMode(true)}
                  >
                    <BiEdit size="20" /> Update
                  </button>
                )}
              </div>
            )}
            {/* User Info */}
            <div className="ml-4 text-center pl-80 pt-16">
              {user && (
                <div>
                  <h1 className="text-3xl font-semibold mb-2">
                    {user.username}
                  </h1>
                  <p className="mb-2">Email: {user.email}</p>
                  {/* User Stats */}
                  <div className="flex justify-between">
                    <div className="font-bold">{user.total_posts} Posts</div>
                    <div className="font-bold">
                      {user.followers_count}{" "}
                      <Link
                        to={{
                          pathname: "/followers",
                          state: { userId: user.id },
                        }}
                      >
                        Followers
                      </Link>
                    </div>
                    <div className="font-bold">
                      {user.followings_count}{" "}
                      <Link
                        to={{
                          pathname: "/following",
                          state: { userId: user.id },
                        }}
                      >
                        Following
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Posts */}

          <div className="container mx-auto p-8">
            {/* ... */}

            {/* Posts */}
            {PostDetailOpen ? (
              <PostDetail
                isOpen={PostDetailOpen}
                onCancel={closeCommentModal}
                postId={selectedPostId}
              />
            ) : (
              <div className="flex justify-center">
                <div className="max-w-4xl w-full p-4 space-y-4">
                  {user && user.total_posts <= 0 && (
                    <h2 className="text-center text-2xl mt-4">No posts yet</h2>
                  )}

                  <div className="pt-10 flex flex-wrap -mx-4">
                    {posts
                      .filter((post) => post.author.id === user.id) // Filter posts by the user
                      .map((post) => (
                        <div
                          key={post.id}
                          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-4"
                        >
                          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img
                              onClick={() => openPostDetailModal(post.id)}
                              className="w-full h-48 object-cover"
                              src={post.img}
                              alt="post_image"
                            />
                            <div className="p-4">
                              <p className="text-gray-700">{post.content}</p>
                              {/* Display other post details */}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {message && <p>{message}</p>}
      </>
    </Layout>
  );
};

export default UserProfile;
