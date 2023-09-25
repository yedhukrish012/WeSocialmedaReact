import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowComments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Define your API endpoint for fetching comments
    const API_URL = `/api/comments/${postId}`; // Replace with your actual API endpoint

    // Fetch comments using Axios
    axios.get(API_URL)
      .then((response) => {
        const { data } = response;
        setComments(data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }, [postId]);

}

export default ShowComments;
