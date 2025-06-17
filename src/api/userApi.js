import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getOrCreateUser = async (auth0User, token) => {
  const response = await axios.post(`${API_URL}/users`, auth0User, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateUserBooks = async (auth0Id, bookData, action, token) => {
  const response = await axios.put(`${API_URL}/users/books`, 
    { auth0Id, bookData, action },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};