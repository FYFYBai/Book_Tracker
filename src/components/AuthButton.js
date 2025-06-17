import axios from 'axios';
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Image } from "react-bootstrap";

const AuthButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        const token = await getIdTokenClaims();
        await axios.post(`${process.env.API_URL}/users/sync-user`, {
          auth0Id: user.sub,
          email: user.email,
          name: user.name
        }, {
          headers: { Authorization: `Bearer ${token.__raw}` }
        });
      }
    };
    syncUser();
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    return (
      <div className="d-flex align-items-center">
        {user.picture && (
          <Image
            src={user.picture}
            roundedCircle
            alt="avatar"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
              border: "1px solid white",
            }}
            className="me-2"
          />
        )}
        <span className="text-white me-2">
          Welcome, {user.name || user.email}
        </span>
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline-light"
      size="sm"
      onClick={loginWithRedirect}
    >
      Login
    </Button>
  );
};

export default AuthButton;