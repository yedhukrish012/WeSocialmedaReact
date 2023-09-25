import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UpdatePostApi = async (postId, content, postImage, fetchData) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (postImage) formData.append('img', postImage);

    const response = await axios.put(
      `${BASE_URL}/post/update-post/${postId}/`,
      formData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log('Updated successfully');
      if (fetchData) {
        fetchData();
      }
    } else {
      console.error(response.error);
    }
  } catch (error) {
    console.error(error);
  }
};

export default UpdatePostApi;
