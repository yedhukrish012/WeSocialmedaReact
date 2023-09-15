import axios from 'axios'
import {BASE_URL} from '../utils/constants'


const createPostApi = async (content, postImage) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('content', content);
        formData.append('img', postImage);

        const response = await axios.post(`${BASE_URL}/post/create-post/`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 201) {
            return response.data;
          } else {
            console.log(response.error);
          }
    }
    catch(error){
        console.log(error);
    }
}

export default createPostApi