import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const { id, volumeInfo } = book;
  const { title, authors, description, imageLinks } = volumeInfo;

  const thumbnail =
    imageLinks?.thumbnail ||
    "https://dummyimage.com/128x192/cccccc/000000&text=No+Cover";

  return (
    <Card
      className="mb-4 shadow-sm book-card-hover"
      style={{ transition: "transform 0.2s ease-in-out" }}
    >
      <Card.Body>
        <div className="d-flex">
          <img
            src={thumbnail}
            alt={title}
            className="me-3"
            style={{
              height: "192px",
              width: "128px",
              objectFit: "cover",
              borderRadius: "5px",
              backgroundColor: "#f0f0f0",
              flexShrink: 0,
            }}
          />

          <div style={{ flex: 1 }}>
            <Card.Title className="text-truncate" title={title}>
              {title}
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted text-truncate"
              title={authors?.join(", ")}
            >
              {authors?.join(", ") || "Unknown Author"}
            </Card.Subtitle>
            <Card.Text className="book-description-truncate">
              {description
                ? description.slice(0, 160) + "..."
                : "No description available."}
            </Card.Text>
            <Button as={Link} to={`/book/${id}`} variant="primary" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
