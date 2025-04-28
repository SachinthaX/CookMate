// src/components/AuthFormWrapper.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AuthFormWrapper = ({ children }) => {
  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg p-4">
            <h2 className="text-center mb-4 text-primary">CookMate 🍳</h2>
            {children}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthFormWrapper;
