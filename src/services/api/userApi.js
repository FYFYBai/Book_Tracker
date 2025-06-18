import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// method to call SyncUser route that is on the server side
export const syncUser = async (auth0User, token) => {
  const response = await axios.post(
    `${API_URL}/users/sync-user`,
    {
      auth0Id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || auth0User.email.split('@')[0]
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
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