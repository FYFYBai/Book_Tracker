import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Row } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import { getUserBooks } from '../services/api/userApi';
import BookCard from '../components/BookCard';

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        const token = await getIdTokenClaims();
        const data = await getUserBooks(user.sub, token.__raw);
        setBooks(data.books);
      } catch (err) {
        setError(err.message || 'Failed to load saved books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isAuthenticated, user, getIdTokenClaims]);

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Card className="text-center shadow-sm p-4">
          <Card.Body>
            <h5 className="mb-3">Please log in to view your saved books</h5>
            <Button href="/" variant="primary">
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p>Loading your saved books...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Card className="text-center shadow-sm p-4">
          <Card.Body>
            <h5 className="mb-3 text-danger">Error</h5>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try Again
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Saved Books</h2>
      
      {books.length === 0 ? (
        <Card className="text-center shadow-sm p-4">
          <Card.Body>
            <h5 className="mb-3">No books saved yet</h5>
            <p className="text-muted">
              You haven't added any books to your dashboard. Start by searching
              for a book you love.
            </p>
            <Button href="/search" variant="primary">
              Search Books
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {books.map((book) => (
            <BookCard 
              key={book.bookId} 
              book={book} 
              isSaved={true} // Add this prop if your BookCard handles saved state
            />
          ))}
        </Row>
      )}
    </Container>
  );


  /*
  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Saved Books</h2>

      {/* Placeholder for when no books are saved yet }
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
  */
};

export default DashboardPage;
