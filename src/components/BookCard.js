import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useSavedBooks from "../hooks/useSavedBooks";

const BookCard = ({ book }) => {
  // Retrieving the book data whether it is coming directly from the google books api or from the datbase
  const isGoogleBook = !!book.volumeInfo;
  const bookData = isGoogleBook ? {
    bookId: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors || [],
    description: book.volumeInfo.description || "",
    image: book.volumeInfo.imageLinks?.thumbnail || "https://dummyimage.com/128x192/cccccc/000000&text=No+Cover",
    link: book.volumeInfo.infoLink || ""
  } : {
    bookId: book.bookId,
    title: book.title,
    authors: book.authors || [],
    description: book.description || "",
    image: book.image || "https://dummyimage.com/128x192/cccccc/000000&text=No+Cover",
    link: book.link || ""
  };

  // simplifying the bookData to easily be referenced in html
  const { title, authors, description, image, link } = bookData;
  const { isAuthenticated } = useAuth0();
  const { isBookSaved, addBook, removeBook } = useSavedBooks();

  const truncate = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "…" : str;

  const trimmedTitle = truncate(title || "Untitled", 40);

  const handleAdd = () => addBook(bookData);
  const handleRemove = () => removeBook(bookData);

  return (
    <Card className="mb-4 shadow-sm book-card-hover">
      <Card.Body>
        <div className="d-flex">
          <img 
            src={image} 
            alt={trimmedTitle}
            className="me-3" 
            style={{ 
              height: "192px", 
              width: "128px", 
              objectFit: "cover", 
              borderRadius: "5px", 
              backgroundColor: "#f0f0f0", 
              flexShrink: 0 
            }} 
          />

          <div style={{ flex: 1 }}>
            <Card.Title className="text-truncate" title={title}>{trimmedTitle}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted text-truncate" title={authors?.join(", ")}>
              {authors?.join(", ") || "Unknown Author"}
            </Card.Subtitle>
            <Card.Text className="book-description-truncate">
              {description ? description.slice(0, 160) + "..." : "No description available."}
            </Card.Text>

            <Button 
              as={Link} 
              to={`/book/${bookData.bookId}`} 
              variant="primary" 
              size="sm" 
              className="me-2"
            >
              View Details
            </Button>

            {isAuthenticated && (
              isBookSaved(bookData.bookId) ? (
                <>
                  <Button variant="secondary" size="sm" disabled className="me-2">
                    Already in My Books
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleRemove}>
                    Delete from My Books
                  </Button>
                </>
              ) : (
                <Button variant="success" size="sm" onClick={handleAdd}>
                  Add to My Books
                </Button>
              )
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
