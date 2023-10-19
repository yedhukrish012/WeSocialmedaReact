import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import createPostApi from "../api/CreatePostApi";
import { FaTimes } from "react-icons/fa";

const PostManage = ({ postId, onCancel }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Set loading state
      await createPostApi(caption, image);
      toast.success("Successfully Created", {
        position: "top-center",
      });
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      toast.error("Failed to Create Post", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);

    // Preview the selected image
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImagePreview(null);
    }
  };

  const handleChooseImageClick = () => {
    // Trigger the click event of the hidden file input
    document.getElementById("image").click();
  };

  const modalRef = useRef();

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

  return (
    <div
      className="overflow-y-hidden fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-40"
    >
      <div ref={modalRef} className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg mx-auto pt-20">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xl font-semibold">create post</p>
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
          {!imagePreview && (
            <div className="mb-4">
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={handleChooseImageClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover-bg-blue-600"
              >
                Add Image
              </button>
            </div>
          )}
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          {imagePreview && caption && (
            <div className="mb-4">
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover-bg-red-600 mr-2"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                Remove Image
              </button>
              {isLoading ? (
                <p className="text-center text-gray-600">Uploading...</p>
              ) : (
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover-bg-green-600"
                  disabled={isLoading}
                >
                  {postId ? "Update Post" : "Create Post"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostManage;
