import axios from 'axios'; // Import axios
import { BASE_URL } from '../utils/constants';

const CreateChatRoomAPI = async (userId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      let body = {}
      const response = await axios.post(`${BASE_URL}/chat/create-room/${userId}/`,body,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      if (response.status === 200) {
        return response.data
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default CreateChatRoomAPI;
  