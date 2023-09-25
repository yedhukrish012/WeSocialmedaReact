import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "axios";
import reportPostApi from "../api/reportPostApi";
import PostManage from "../components/PostManage";
import deletePostApi from "../api/deletePostApi";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import LikeUnlikePostApi from "../api/LikeUnlikePostApi";
import FollowUnfollowApi from "../api/FollowUnfollowApi";
import CommentModal from "../components/CommentModal";
import UpdatePost from "../components/UpdatePost";

const HomePage = () => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post is expanded
  const accessToken = localStorage.getItem("access_token");
  const { loading, isAuthenticated, user, isSuperuser } = useSelector(
    (state) => state.user
  );
  const [Modal, setModal] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [updatePostModalOpen, setUpdatePostModalOpen] = useState(false); // State for the update post modal

  const ModalCancel = () => {
    setModal(false);
  };

  const openUpdatePostModal = (postId, post) => {
    setSelectedPostId(postId);
    setSelectedPost(post);
    setUpdatePostModalOpen(true);
  };

  const closeUpdatePostModal = () => {
    setUpdatePostModalOpen(false);
  };

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
  }, [accessToken, Modal, updatePostModalOpen, trigger]);

  if (!isAuthenticated && !loading && user === null) {
    return <Navigate to="/" />;
  }

  if (isAuthenticated && isSuperuser) {
    return <Navigate to="/adm" />;
  }

  const handleReportPost = async (postId) => {
    try {
      await reportPostApi(postId, posts);
      toast.success("Post Reported successfully!", {
        position: "top-center",
      });
    } catch (err) {
      toast.error("Failure, Post not Reported!", {
        position: "top-center",
      });
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await LikeUnlikePostApi(postId);
      setTrigger(false);
    } catch (error) {
      toast.error("Failure, Post not Liked!", {
        position: "top-center",
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePostApi(postId);
      toast.success("Post Deleted Successfully!", {
        position: "top-center",
      });
      setTrigger(false);
    } catch (error) {
      toast.error("Post Not Deleted!", {
        position: "top-center",
      });
    }
  };

  const handleFollowUnfollow = async (userId) => {
    try {
      await FollowUnfollowApi(userId);
      setTrigger(false);
    } catch {
      console.log("follow/unfollow got error");
    }
  };

  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
  };

  // Function to close the CommentModal
  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  // Toggle the expanded post when the dots are clicked
  const toggleExpandedPost = (postId) => {
    setExpandedPostId((prevState) => (prevState === postId ? null : postId));
  };

  console.log(user, "iam the user");
  console.log(posts, "iam the post");

  return (
    <Layout
      title="Social Media Dummy Home Page"
      content="Welcome to our social media platform "
    >
      <div className="p-8 grid  grid-cols-1 md:grid-cols-5 mt-16">
        {" "}
        {/* Add margin-top to accommodate the fixed navbar */}
        <div className="col-span-1 bg-white shadow-lg p-5  fixed h-80 w-80">
          {/* Adding "p-4 pt-8" to create a gap and "w-80" to control the width */}
          <div className="flex flex-col items-center">
            <Link to="/profile">
              <img
                className="w-20 h-20 rounded-full mb-4"
                src={`${BASE_URL}${user.profile_pic}`}
                alt="user_image"
              />
            </Link>
            <span className="font-bold text-center mb-2">{user.username}</span>
            <span className="text-gray-600 text-center mb-4">{user.email}</span>
            <div className="flex justify-between pb-1 w-full mb-2">
              <div className="font-bold">{user.total_posts} Posts</div>
              <div className="font-bold">
                {user.followers_count}{" "}
                <Link
                  to={{ pathname: "/followers", state: { userId: user.id } }}
                >
                  Followers
                </Link>
              </div>
              <div className="font-bold">
                {user.followings_count}{" "}
                <Link
                  to={{ pathname: "/following", state: { userId: user.id } }}
                >
                  Following
                </Link>
              </div>
            </div>
            <button
              onClick={() => setModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full h-10 rounded-full"
            >
              Add Post
            </button>
          </div>
        </div>
        <div className="col-span-4 ml-64 p-4 ">
          <div className="grid gap-4 justify-center ">
            {Modal && <PostManage onCancel={ModalCancel} />}
            {updatePostModalOpen && selectedPostId && (
              <UpdatePost
                isOpen={updatePostModalOpen}
                onCancel={closeUpdatePostModal}
                postId={selectedPostId}
                post={selectedPost}
                onPostUpdated={() => {
                  setTrigger(true);
                  closeUpdatePostModal();
                }}
              />
            )}
            {posts.map((post) => (
              <div
                key={post.id}
                className={`bg-white w-90 h-full border-t-5 border-black-500 rounded-lg shadow-lg p-4 relative`}
              >
                <div className="flex items-center mb-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={post.author.profile_pic}
                    alt="user_image"
                  />
                  <span className="ml-2 font-bold">{post.author.username}</span>
                  {user.id !== post.author.id && (
                    <button
                      onClick={() => {
                        handleFollowUnfollow(post.author.id);
                        setTrigger(true);
                      }}
                      className={`ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ${
                        post.is_following_author
                          ? "bg-red-500 hover:bg-red-700"
                          : ""
                      }`}
                    >
                      {post.is_following_author ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
                <div
                  className={`absolute top-2 right-2 z-10 cursor-pointer ${
                    expandedPostId === post.id
                      ? "text-red-500"
                      : "text-gray-600"
                  }`}
                  onClick={() => toggleExpandedPost(post.id)}
                >
                  ...
                </div>
                <div
                  className={`relative group ${
                    expandedPostId === post.id ? "border-b border-red-500" : ""
                  }`}
                >
                  <img
                    className="rounded-lg w-96 h-80 object-cover mt-2"
                    src={post.img}
                    alt="post_image"
                  />

                  {expandedPostId === post.id && (
                    <div>
                      {user.username !== post.author.username && (
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Report Post
                        </button>
                      )}

                      {user.username === post.author.username && (
                        <>
                          <button
                            onClick={() => openUpdatePostModal(post.id, post)} // Open the update post modal when this button is clicked
                            className="absolute top-14 right-2 z-10 bg-orange-600 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded"
                          >
                            Update Post
                          </button>
                          <button
                            onClick={() => {
                              handleDeletePost(post.id);
                              setTrigger(true);
                            }}
                            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Delete Post
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-2xl font-bold mt-2 text-center">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    {post.content}
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        handleToggleLike(post.id);
                        setTrigger(true);
                      }}
                      className="items-center space-x-2 cursor-pointer"
                    >
                      {post.likes.includes(user.id) ? (
                        <AiFillHeart
                          color="red"
                          className="items-center w-10 h-8"
                        />
                      ) : (
                        <AiOutlineHeart className="w-10 h-8" />
                      )}
                      <span className="text-gray-600">{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => openCommentModal(post.id)}
                      className="pl-4 items-center space-x-2 cursor-pointer"
                    >
                      <AiOutlineComment className="w-8 h-8" />
                      <span className="items-center pr-2 text-gray-600">
                        {post.comments.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCommentModalOpen && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onRequestClose={closeCommentModal}
          postId={selectedPostId}
        />
      )}
    </Layout>
  );
};

export default HomePage;
