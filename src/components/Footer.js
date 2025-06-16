import { Container } from "react-bootstrap";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-dark text-light py-3 mt-5">
      <Container className="d-flex justify-content-between align-items-center">
        <small>&copy; 2025 Book Tracker App. All rights reserved.</small>
        <button
          onClick={scrollToTop}
          className="btn btn-outline-light btn-sm"
          style={{ borderRadius: "20px" }}
        >
          ↑ Back to Top
        </button>
      </Container>
    </footer>
  );
};

export default Footer;
