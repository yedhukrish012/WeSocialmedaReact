import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "axios";
import reportPostApi from "../api/reportPostApi";
import PostManage from "../components/PostManage";
import deletePostApi from "../api/deletePostApi";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post is expanded
  const accessToken = localStorage.getItem("access_token");
  const { loading, isAuthenticated, user, isSuperuser } = useSelector(
    (state) => state.user
  );
  const [Modal, setModal] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const ModalCancel = () => {
    setModal(false);
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
  }, [accessToken, Modal,trigger]);

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


  const handleDeletePost = async (postId)=>{
    try{
      await deletePostApi(postId)
      toast.success('Post Deleted Sucessfully.!',{
        position: 'top-center',
      });
      setTrigger(false);
    }catch(error){
      toast.error('Post Not Deleted.!',{
        position:'top-center',
      });
    }
  }; 

  // Toggle the expanded post when the dots are clicked
  const toggleExpandedPost = (postId) => {
    setExpandedPostId((prevState) => (prevState === postId ? null : postId));
  };

  console.log(user, "iam the user");

  return (
    <Layout
      title="Social Media Dummy Home Page"
      content="Welcome to our social media platform"
    >
      <div className="pt-10 flex-col  justify-center items-center h-screen relative">
        <button onClick={() => setModal(true)} className="sticky top-0 right-0">
          ADD post
        </button>

        <div className="grid gap-4 justify-center">
          {Modal && <PostManage onCancel={ModalCancel} />}
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white w-80 h-full border-t-4 border-red-500 rounded-lg shadow-lg p-4`}
            >
              <div
                className={`relative group ${
                  expandedPostId === post.id ? "border-b border-red-500" : ""
                }`}
              >
                <img
                  className="rounded-lg h-72 w-full object-cover"
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
                      <button
                      onClick={() => {
                        handleDeletePost(post.id);
                        setTrigger(true); // Set trigger to true when delete button is clicked
                      }}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete Post
                    </button>
                    )}
                  </div>
                )}
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
              </div>
              <div className="p-4">
                <h2 className="text-2xl font-bold mt-2 text-center">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-center mb-6">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
