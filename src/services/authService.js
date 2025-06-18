import { syncUser } from './api/userApi';

// using the auth0 id and bearer token to sync the auth0 user
// calls the sync-user method through the route /users/sync-user
export const syncAuth0User = async (auth0User, token) => {
  try {
    syncUser(auth0User, token);
  } catch (error) {
    console.error('Auth sync failed:', error);
    throw error;
  }
};