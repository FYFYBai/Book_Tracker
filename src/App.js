import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import BookDetailPage from "./pages/BookDetailPage";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserSync from "./components/UserSync";

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Logging in...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <h2>Oops! Login Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <Router>
      <UserSync />
      <AppNavbar />
      <div className="main-content container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
