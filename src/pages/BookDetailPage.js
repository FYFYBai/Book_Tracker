import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Container, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading book details...</p>
      </Container>
    );
  }

  if (!book || !book.volumeInfo) {
    return <Container className="mt-5">Book not found.</Container>;
  }

  const {
    title,
    authors,
    publisher,
    publishedDate,
    description,
    pageCount,
    categories,
    averageRating,
    ratingsCount,
    imageLinks,
    previewLink,
    infoLink,
  } = book.volumeInfo;

  const thumbnail =
    imageLinks?.thumbnail ||
    "https://via.placeholder.com/200x300?text=No+Cover";

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4">
        <div className="d-flex flex-column flex-md-row align-items-start">
          <img
            src={thumbnail}
            alt={title}
            className="mb-3 mb-md-0 me-md-4"
            style={{
              width: "200px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "5px",
              flexShrink: 0,
              backgroundColor: "#f9f9f9",
            }}
          />
          <div>
            <h2 className="mb-2">{title}</h2>
            <p>
              <strong>Author(s):</strong>{" "}
              {authors?.join(", ") || "Unknown Author"}
            </p>
            <p>
              <strong>Publisher:</strong> {publisher || "N/A"}
            </p>
            <p>
              <strong>Published:</strong> {publishedDate || "Unknown"}
            </p>
            <p>
              <strong>Pages:</strong> {pageCount || "N/A"}
            </p>

            {categories && (
              <div className="mb-3">
                <strong>Categories:</strong>{" "}
                {categories.map((cat, i) => (
                  <Badge
                    key={i}
                    bg="secondary"
                    className="me-1 mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/search?category=${encodeURIComponent(cat)}`)
                    }
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            )}

            {averageRating && (
              <p>
                <strong>Rating:</strong> {averageRating} ⭐ ({ratingsCount || 0}{" "}
                ratings)
              </p>
            )}

            <div className="d-flex gap-2 mt-3">
              {previewLink && (
                <a
                  href={previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  Preview
                </a>
              )}
              {infoLink && (
                <a
                  href={infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm"
                >
                  More Info
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <div>
          <h5>Description:</h5>
          <p
            style={{ lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{
              __html: description || "No description available.",
            }}
          ></p>
        </div>
      </Card>
    </Container>
  );
};

export default BookDetailPage;
