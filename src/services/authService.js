import axios from 'axios';

// using .env value
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// using the auth0 id and bearer token to sync the auth0 user
// calls the sync-user method through the route /users/sync-user
export const syncAuth0User = async (auth0User, token) => {
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
  } catch (error) {
    console.error('Auth sync failed:', error);
    throw error;
  }
};