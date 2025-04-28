import React, { useState } from "react";
import { Button, Form, Spinner, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      const token = res.data.token;

      localStorage.setItem("token", token);
      setToken(token);

      const profileRes = await getProfile();
      setUser(profileRes.data);

      navigate("/home");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
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
            <h2 className="text-center text-primary mb-4">CookMate 🍳</h2>
            <Form onSubmit={handleSubmit}>
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
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Log In"}
                </Button>
                <Button variant="success" onClick={() => navigate("/register")}>
                  Create new account
                </Button>

                {/* ✅ Google Login */}
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
                  Sign in with Google
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

export default Login;
