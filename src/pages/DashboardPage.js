import { Container, Card, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const DashboardPage = () => {
  const { user } = useAuth0();

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Saved Books</h2>

      {/* Placeholder for when no books are saved yet */}
      <Card className="text-center shadow-sm p-4">
        <Card.Body>
          <h5 className="mb-3">No books saved yet</h5>
          <p className="text-muted">
            You haven’t added any books to your dashboard. Start by searching
            for a book you love.
          </p>
          <Button href="/search" variant="primary">
            Search Books
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPage;
