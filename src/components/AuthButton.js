import { useAuth0 } from "@auth0/auth0-react";
import { Button, Image } from "react-bootstrap";

const AuthButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <>
      {isAuthenticated ? ( // if the user is authenticated show their icon and username
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
        </div>)
      :(<Button
          variant="outline-light"
          size="sm"
          onClick={loginWithRedirect}
        >
          Login
        </Button>
      )}
    </>
  );
};

export default AuthButton;