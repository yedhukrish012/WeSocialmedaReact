
import { BASE_URL } from "../utils/constants";


const deletePostApi = async (id) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await fetch(`${BASE_URL}/post/delete/${id}/`, {
      method: "delete", 
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    if (response.status === 200) {
    } else {
      console.error("Post not deleted");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

export default deletePostApi;



