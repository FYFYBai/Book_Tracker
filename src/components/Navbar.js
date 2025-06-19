import { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import AuthButton from "./AuthButton";
import { ThemeContext } from "../ThemeContext";

const AppNavbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Navbar bg={theme} variant={theme} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Book Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/search">
              Search
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              My Books
            </Nav.Link>
          </Nav>

          {/* Old Auth Section 
          <Nav className="ms-auto align-items-center">
            {isAuthenticated && user && (
              <>
                <span className="text-white me-2">
                  {user.picture && (
                    <Image
                      src={user.picture}
                      roundedCircle
                      alt="avatar"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                        border: "1px solid white",
                      }}
                      className="me-2"
                    />
                  )}
                  Welcome, {user.name || user.email}
                </span>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={loginWithRedirect}
              >
                Login
              </Button>
            )}
          </Nav>
          */}

          {/* Simplified Auth Section
          <Nav className="ms-auto">
            <AuthButton />
          </Nav> */}
          {/* Simplified Auth + Theme Switch Section */}
          <Nav className="ms-auto align-items-center">
            <Button
              variant={theme === "dark" ? "light" : "dark"}
              size="sm"
              className="me-2"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </Button>
            <AuthButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
