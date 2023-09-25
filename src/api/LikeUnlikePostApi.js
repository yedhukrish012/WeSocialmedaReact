
import axios from 'axios'; // Import axios
import { BASE_URL } from '../utils/constants';

const LikeUnlikePostApi = async (postId, fetchData) => { // Add async and postId parameter
  try {
    let accessToken = localStorage.getItem('access_token');

    const response = await axios.post(`${BASE_URL}/post/like/${postId}/`, {}, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      console.log('Post liked/unliked');
      if (fetchData) {
        fetchData();
      }
      return response.data;
    } else {
      console.log(response.error);
    }
  } catch (error) {
    console.log(error);
  }
};

export default LikeUnlikePostApi;
