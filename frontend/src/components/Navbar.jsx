import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Navbar as BootstrapNavbar, Nav, Form, Button, Image } from 'react-bootstrap';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/home?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <BootstrapNavbar expand="lg" bg="light" className="shadow-sm" style={{ padding: '10px 20px' }}>
      <Container fluid>
        <Link to="/home" className="navbar-brand fw-bold text-primary" style={{ fontSize: '24px' }}>
          CookMate 🍳
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarScroll" />
        <BootstrapNavbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {user && (
              <Nav.Link as={Link} to="/profile" className="text-dark"></Nav.Link>
            )}
          </Nav>

          {user && (
            <Form className="d-flex me-3" onSubmit={handleSearchSubmit} style={{ width: '250px' }}>
              <Form.Control
                type="search"
                placeholder="Search users..."
                className="me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="outline-primary" type="submit">Search</Button>
            </Form>
          )}

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Image
                src={user?.profileImage || "/assets/av.avif"}
                alt="Avatar"
                roundedCircle
                style={{ height: 40, width: 40, objectFit: 'cover', border: "2px solid #0d6efd" }}
              />
              <Link to="/profile" className="text-decoration-none fw-semibold text-primary">My Profile</Link>
              <Button variant="outline-danger" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline-primary" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
