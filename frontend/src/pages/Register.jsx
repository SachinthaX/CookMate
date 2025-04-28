import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/assets/loginbg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col md={4}>
          <Card className="shadow p-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "20px" }}>
            <h2 className="text-center text-success mb-4">Join CookMate 🍳</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="success" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Create Account"}
                </Button>
                <Button variant="primary" onClick={() => navigate("/login")}>
                  Back to Login
                </Button>
                  <Button
                  
                  variant="outline-primary"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width="20"
                    height="20"
                  />
                  Continue with Google
                </Button>
                  
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Register;
