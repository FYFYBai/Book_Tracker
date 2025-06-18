import { useState, useEffect } from 'react';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define and call the fetchFictionBooks function inside the useEffect(() => {}, []) to run once when the route loads
  useEffect(() => {
    const fetchFictionBooks = async () => {
      try {
        const res = await fetch(
          'https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=12'
        );
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        setBooks(data.items || []);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching books:', error);
      } finally {
        // Stop showing loading text
        setLoading(false);
      }
    };

    fetchFictionBooks();
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <Title>Popular Books</Title>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
          <p>Loading books...</p>
        </div>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <Title>Popular Books</Title>
        <Alert variant="danger" className="text-center">
          <h4>Error loading books</h4>
          <p>{error}</p>
        </Alert>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Title>Popular Books</Title>
      <Row>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Row>
    </HomeContainer>
  );
};

const HomeContainer = styled(Container)`
  padding: 2rem 0;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
`;

export default Home;