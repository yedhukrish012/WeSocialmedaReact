import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const createCommentApi = async (postId, commentText) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('content', commentText);

    const response = await axios.post(`${BASE_URL}/post/create-comment/${postId}/`, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 201) {
        
    } else {
      throw new Error('Failed to create comment');
    }
  } catch (error) {
    throw error;
  }
};

export default createCommentApi;
