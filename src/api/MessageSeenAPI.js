import axios from "axios";
import { BASE_URL } from "../utils/constants";

const MessageSeenAPI = async (userId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(`${BASE_URL}/chat/seen/${userId}/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if  (response.status === 200) {
          return response.data;
      } else {
          console.log(response.error)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default MessageSeenAPI;