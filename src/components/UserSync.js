import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
// Use Sync-User axios call through this service 
import { syncAuth0User } from '../services/authService';

// Component that just renders when there is a change in user to sync that user
const UserSync = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const handleUserSync = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getIdTokenClaims();
          // use service to call syncUser route
          await syncAuth0User(user, token.__raw);
          console.log('User synchronized successfully');
        } catch (error) {
          console.error('User synchronization failed:', error);
        }
      }
    };

    handleUserSync();
  }, [isAuthenticated, user, getIdTokenClaims]);

  return null; // This component doesn't render anything
};

export default UserSync;