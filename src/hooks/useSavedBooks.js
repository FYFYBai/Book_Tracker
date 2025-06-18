import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Utility Hook to manage user's books
 */

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const useSavedBooks = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [savedBooks, setSavedBooks] = useState([]);

  const fetchSavedBooks = async () => {
    const token = await getAccessTokenSilently();
    const response = await axios.post(`${API_URL}/users/sync-user`, {
      auth0Id: user.sub,
      email: user.email,
      name: user.name
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setSavedBooks(response.data.savedBooks || []);
  };

  const modifyBook = async (bookData, action) => {
    const token = await getAccessTokenSilently();
    const response = await axios.put(`${API_URL}/users/books`, {
      auth0Id: user.sub,
      bookData,
      action
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSavedBooks(response.data);
  };

  const isBookSaved = (bookId) => {
    return savedBooks.some(book => book.bookId === bookId);
  };

  useEffect(() => {
    if (user) fetchSavedBooks();
  }, [user]);

  return { savedBooks, isBookSaved, addBook: (b) => modifyBook(b, 'add'), removeBook: (b) => modifyBook(b, 'remove') };
};

export default useSavedBooks;
