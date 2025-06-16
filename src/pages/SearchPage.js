import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { Form, Button, Pagination } from "react-bootstrap";

const SearchPage = () => {
  // Extract search query and page number from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // Component state variables
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStartIndex, setApiStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState("");
  const [pendingPageSlice, setPendingPageSlice] = useState(null);
  const [firstSearchDone, setFirstSearchDone] = useState(false);
  const [lastFetchedQuery, setLastFetchedQuery] = useState("");

  // Constants for paging and API result batch size
  const booksPerPage = 10;
  const apiPageSize = 30;
  const maxBooks = 120;

  // Update URL parameters and internal state
  const updateSearchParams = (newQuery, newPage) => {
    setSearchParams({ q: newQuery, page: newPage });
    setQuery(newQuery);
    setCurrentPage(newPage);
    setFirstSearchDone(false); // <-- allow re-search
  };

  // Fetch initial search result from Google Books API
  const handleSearch = async () => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      // Clear results if empty
      setBooks([]);
      setDisplayBooks([]);
      setSelectedCategory(null);
      return;
    }

    // Proceed only if searchTerm is valid
    setLoading(true);
    try {
      const encoded = encodeURIComponent(searchTerm);
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encoded}&startIndex=0&maxResults=${apiPageSize}`
      );
      const data = await res.json();
      const allItems = data.items || [];

      setBooks(allItems);
      setApiStartIndex(apiPageSize);
      setSelectedCategory(null);
      setSortType("");
      setLastFetchedQuery(searchTerm);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch next batch of books and append to existing list
  const fetchMoreBooks = async () => {
    const searchTerm = query.trim();
    if (!searchTerm || books.length >= maxBooks) return;

    const encoded = encodeURIComponent(searchTerm);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encoded}&startIndex=${apiStartIndex}&maxResults=${apiPageSize}`
    );
    const data = await res.json();
    const newItems = data.items || [];

    if (newItems.length > 0) {
      setBooks((prev) => [...prev, ...newItems]);
      setApiStartIndex((prev) => prev + apiPageSize);
    }
  };

  // When URL query or page changes, initiate search
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    setQuery(urlQuery);
    setCurrentPage(urlPage);

    // Only fetch if:
    // 1. There’s a query
    // 2. And it's different from lastFetchedQuery
    if (urlQuery && urlQuery !== lastFetchedQuery) {
      const delay = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [searchParams]);

  // Main logic to slice and display filtered books
  useEffect(() => {
    // Start with the full book list
    let filtered = [...books];

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter((book) =>
        book.volumeInfo?.categories?.includes(selectedCategory)
      );
    }

    // Apply sorting
    if (sortType === "newest") {
      filtered.sort((a, b) =>
        (b.volumeInfo.publishedDate || "").localeCompare(
          a.volumeInfo.publishedDate || ""
        )
      );
    } else if (sortType === "rating") {
      filtered.sort(
        (a, b) =>
          (b.volumeInfo.averageRating || 0) - (a.volumeInfo.averageRating || 0)
      );
    }

    // Determine the range of books for the current page
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;

    // If we don’t have enough books loaded yet to show this page,
    // and haven’t hit the maxBooks limit, trigger a fetch
    if (end > filtered.length && books.length < maxBooks) {
      setPendingPageSlice({ start, end });

      // Check if fetching 30 more books would be enough to cover this page
      const stillNeeded = end - books.length;
      const willHaveEnough = books.length + apiPageSize >= end;

      if (willHaveEnough) {
        fetchMoreBooks(); // fetch only if it would help cover the current page
      }
    } else {
      // If we have enough data, just display the correct slice
      setDisplayBooks(filtered.slice(start, end));
    }
  }, [books, selectedCategory, currentPage, sortType]);

  // Apply deferred page slice after new books are fetched
  useEffect(() => {
    if (!pendingPageSlice) return;

    const { start, end } = pendingPageSlice;
    if (books.length >= end) {
      let filtered = [...books];

      if (selectedCategory) {
        filtered = filtered.filter((book) =>
          book.volumeInfo?.categories?.includes(selectedCategory)
        );
      }

      if (sortType === "newest") {
        filtered.sort((a, b) =>
          (b.volumeInfo.publishedDate || "").localeCompare(
            a.volumeInfo.publishedDate || ""
          )
        );
      } else if (sortType === "rating") {
        filtered.sort(
          (a, b) =>
            (b.volumeInfo.averageRating || 0) -
            (a.volumeInfo.averageRating || 0)
        );
      }

      setDisplayBooks(filtered.slice(start, end));
      setPendingPageSlice(null);
    }
  }, [books, pendingPageSlice, selectedCategory, sortType]);

  // Extract all unique categories from books for filtering UI
  const extractCategories = () => {
    const set = new Set();
    books.forEach((book) => {
      book.volumeInfo?.categories?.forEach((cat) => set.add(cat));
    });
    return Array.from(set);
  };

  // Compute total pages after category filtering
  const totalFiltered = books.filter(
    (book) =>
      !selectedCategory ||
      book.volumeInfo?.categories?.includes(selectedCategory)
  ).length;
  const totalPages = Math.ceil(totalFiltered / booksPerPage);

  return (
    <div>
      <h2 className="mb-4">Search for Books</h2>

      {/* Search Form */}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          updateSearchParams(query, 1);
        }}
        className="mb-4"
      >
        <div className="d-flex flex-column flex-md-row gap-2">
          <Form.Control
            type="text"
            value={query}
            onChange={(e) => updateSearchParams(e.target.value, 1)}
            placeholder="Enter a book title, author, or keyword"
            className="rounded-pill px-3"
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchParams({});
              setBooks([]);
              setDisplayBooks([]);
              setSelectedCategory(null);
              setSortType("");
            }}
          >
            Clear
          </Button>
        </div>
      </Form>

      {/* Sort Dropdown */}
      {books.length > 0 && (
        <Form.Group className="mb-4">
          <Form.Label>Sort by:</Form.Label>
          <Form.Select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="">Relevance (Default)</option>
            <option value="newest">Published Date (Newest)</option>
            <option value="rating">Average Rating (High to Low)</option>
          </Form.Select>
        </Form.Group>
      )}

      <div className="row">
        {/* Category Filter Sidebar */}
        {books.length > 0 && (
          <div className="col-md-3 mb-3 pe-md-4">
            <h5>Filter by Category</h5>
            <ul className="list-group">
              {extractCategories().map((cat, idx) => (
                <li
                  key={idx}
                  className={`list-group-item ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedCategory(cat === selectedCategory ? null : cat);
                    updateSearchParams(query, 1);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Book Results */}
        <div className="col-md-9">
          {loading && <p>Loading...</p>}
          {!loading && displayBooks.length === 0 && books.length > 0 && (
            <p>Loading more books...</p>
          )}
          {!loading && displayBooks.length === 0 && books.length === 0 && (
            <p>No results found.</p>
          )}
          {!loading &&
            displayBooks.map((book) => (
              <div key={book.id} className="fade-in">
                <BookCard book={book} />
              </div>
            ))}
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() =>
                updateSearchParams(query, Math.max(currentPage - 1, 1))
              }
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => updateSearchParams(query, i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => updateSearchParams(query, currentPage + 1)}
              disabled={displayBooks.length === 0}
            >
              Next &gt;
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
