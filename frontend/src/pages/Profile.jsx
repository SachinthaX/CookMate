import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Form, Modal, Spinner } from 'react-bootstrap';
import { getProfile, getMyPosts, updateBio } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [newBio, setNewBio] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
        setNewBio(res.data.bio || '');
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await getMyPosts();
        setUserPosts(res.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
      }
    };

    Promise.all([fetchUserData(), fetchUserPosts()])
      .finally(() => setLoading(false));
  }, []);

  const handleSaveBio = async () => {
    try {
      await updateBio(newBio);
      setUser({ ...user, bio: newBio });
      setShowEdit(false);
    } catch (err) {
      console.error('Error updating bio:', err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {/* Profile Header */}
      <Card className="shadow p-4 mb-5" style={{ borderRadius: '20px' }}>
        <Row className="align-items-center">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Image
              src={user?.profileImage || '/assets/av.avif'}
              roundedCircle
              style={{ width: "150px", height: "150px", objectFit: "cover", border: "3px solid #0d6efd" }}
            />
          </Col>
          <Col md={8}>
            <h2 className="mb-0">{user?.name || 'Anonymous'}</h2>
            <p className="text-muted">{user?.email}</p>
            <p><strong>Bio:</strong> {user?.bio || 'No bio yet.'}</p>

            {/* Account Stats */}
            <Row className="text-center my-3">
              <Col>
                <h6 className="text-primary">Posts</h6>
                <p>{userPosts.length}</p>
              </Col>
              <Col>
                <h6 className="text-primary">Followers</h6>
                <p>{user?.followers?.length || 0}</p>
              </Col>
              <Col>
                <h6 className="text-primary">Following</h6>
                <p>{user?.following?.length || 0}</p>
              </Col>
            </Row>

            <Button variant="outline-primary" onClick={() => setShowEdit(true)}>Edit Bio</Button>
          </Col>
        </Row>
      </Card>

      {/* My Posts Section */}
      <h4 className="mb-4 text-center text-primary">🖼️ My Posts</h4>
      <Row>
        {userPosts.length === 0 ? (
          <p className="text-muted text-center">You haven't posted anything yet.</p>
        ) : (
          userPosts.map((post) => (
            <Col md={4} className="mb-4" key={post._id}>
              <Card className="shadow-sm h-100 card-hover">
                {post.mediaUrls?.[0] && (
                  post.mediaUrls[0].endsWith('.mp4') ? (
                    <video width="100%" controls className="rounded-top">
                      <source src={post.mediaUrls[0]} type="video/mp4" />
                    </video>
                  ) : (
                    <Card.Img variant="top" src={post.mediaUrls[0]} className="rounded-top" />
                  )
                )}
                <Card.Body>
                  <Card.Text>{post.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Edit Bio Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Bio</Form.Label>
              <Form.Control
                type="text"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveBio}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
