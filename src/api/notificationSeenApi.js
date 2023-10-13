import axios from 'axios';

import { BASE_URL } from '../utils/constants';

const notificationSeenApi = async (notificationId) =>  {
  try {
    const accessToken = localStorage.getItem('access_token');

    // Make sure to include the 'Content-Type' header and remove extra object nesting
    const response = await axios.post(
      `${BASE_URL}/post/notifications-seen/${notificationId}/`,
      null, // No request body, you can use null
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json', // Include the Content-Type header
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error:', response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
};

export default notificationSeenApi;
