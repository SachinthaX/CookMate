import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';

const dummyPosts = [
  {
    id: 1,
    user: {
      name: 'Nethmi Perera',
      profileImage: 'https://i.pravatar.cc/150?img=11',
    },
    description: 'Just made this creamy mushroom pasta 🍝🔥!',
    mediaUrls: ['/assets/1.avif'],
  },
  {
    id: 2,
    user: {
      name: 'Ashan Fernando',
      profileImage: 'https://i.pravatar.cc/150?img=25',
    },
    description: 'Homemade chocolate cake for the win 🎂💯',
    mediaUrls: ['/assets/2.avif'],
  },
  {
    id: 3,
    user: {
      name: 'Thilini Jayasuriya',
      profileImage: 'https://i.pravatar.cc/150?img=20',
    },
    description: 'Refreshing tropical fruit salad 🍍🍓🍉',
    mediaUrls: ['/assets/3.avif'],
  },
];

const Home = () => {
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🍳 CookMate Community Feed</h2>

      {/* Dummy Posts Section */}
      <Row>
        {dummyPosts.map((post) => (
          <Col md={6} lg={4} className="mb-4" key={post.id}>
            <Card className="shadow-sm">
              <Card.Header className="d-flex align-items-center">
                <Image
                  src={post.user.profileImage}
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-2"
                />
                <strong>{post.user.name}</strong>
              </Card.Header>
              <Card.Body>
                <Card.Text>{post.description}</Card.Text>
                {post.mediaUrls.map((url, idx) => (
                  <Image key={idx} src={url} alt="Post media" thumbnail fluid className="mb-2" />
                ))}
              </Card.Body>
              <Card.Footer>
                <Button size="sm" variant="outline-primary" className="me-2">👍 Like</Button>
                <Button size="sm" variant="outline-secondary">💬 Comment</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
