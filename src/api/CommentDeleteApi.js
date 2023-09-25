
import { BASE_URL } from '../utils/constants';

const CommentDeleteApi = async (id) => {

    const accessToken = localStorage.getItem("access_token");
  try {
    const response = await fetch(`${BASE_URL}/post/delete-comment/${id}/`, {
      method: "delete", 
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    if (response.status === 200) {
    } else {
      console.error("Comment not deleted");
    }
  } catch (error) {
    console.error("Error deleting Comment:", error);
  }
};

export default CommentDeleteApi
