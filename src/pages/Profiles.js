
import { Navigate } from "react-router-dom";

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BASE_URL } from "../utils/constants";
import Axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import PostDetail from "../components/PostDetail";
import { useSelector } from "react-redux";

const Profiles = () => { 
  const { id } = useParams()
  const [user, setUser] = useState(null); 
  const [posts, setPosts] = useState([]);
  const [PostDetailOpen, setPostDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { isAuthenticated} = useSelector((state) => state.user);
  const accessToken = localStorage.getItem("access_token"); 
  

  useEffect(() => {
    // Fetch user data using the GetUserView API and the passed userId prop
    Axios.get(`${BASE_URL}/getusers/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch user's posts
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
  }, [id, accessToken])

  const openPostDetailModal = (postId) => {
    setSelectedPostId(postId);
    setPostDetailOpen(true);
  };

  // Function to close the CommentModal
  const closeCommentModal = () => {
    setPostDetailOpen(false);
  };

  // Check if the user object is initialized before accessing its properties
  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(id, "iam the id who cameeee")
  console.log(user)

  if (!isAuthenticated  && user === null) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
        <Layout
      title="user profile"
      content="Welcome to our social media user profile"
    >
      <>
        <div className="container  mx-auto  ">
          <div className="flex">
            {user && (
              <div className="text-center pl-48 pt-24">
                <img
                  className="w-40 h-40 rounded-full mb-4"
                  src={user.profile_pic}
                  alt="user_image"
                />
              </div>
            )}
            {/* User Info */}
            <div className="ml-4 text-center pt-28 ">
              {user && (
                <div className=' pl-56'>
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
      </>
    </Layout>
    </div>
  )
}

export default Profiles



