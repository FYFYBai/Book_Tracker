import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// method to call SyncUser route that is on the server side
export const syncUser = async (auth0User, token) => {
  try {
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
  } catch (err) {
    throw err;
  }
};

export const updateUserBooks = async (auth0Id, bookData, action, token) => {
  try {
    const response = await axios.put(`${API_URL}/users/books`, 
      { auth0Id, bookData, action },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
  
};

export const getUserBooks = async (auth0Id, token) => {
  try {
    const response = await axios.get(
    `${API_URL}/users/${auth0Id}/books`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};