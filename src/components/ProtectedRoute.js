import { Container, Alert } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Container className="mt-4">
        <Alert variant="warning">
          Please <Link to="/">log in</Link> to view your saved books.
        </Alert>
        <Alert variant="info">
          Or go back to the <Link to="/">home page</Link> to view more books.
        </Alert>
      </Container>;
  }

  return children;
};

export default ProtectedRoute;