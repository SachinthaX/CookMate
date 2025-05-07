import React, { useState } from "react";
import { FaRegHeart, FaRegCommentDots, FaShareAlt } from "react-icons/fa";
import { Container, Card, Image, Button, Form } from "react-bootstrap";

const posts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      role: "Professional Chef",
      isVerified: true,
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    content: "Just finished creating a new recipe for honey-glazed salmon with asparagus. The key is to use high-quality honey and fresh herbs!",
    image: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.NxaMPMi0bwam6UbtwCoSdQHaE8%26cb%3Diwc1%26pid%3DApi&sp=1746633499T36246849d0857a7f89cf671134fc28864c21bb9224042fbef2c1344d63562797",
  },
  {
    id: 2,
    user: {
      name: "Mark Williams",
      role: "Home Cook Enthusiast",
      isVerified: false,
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    content: "Attended my first sourdough workshop today. Learning to make your own starter is a game-changer! Anyone else into bread making?",
    image: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.CcP4-EzBYjn8LRzkSRGkhAHaEK%26cb%3Diwc1%26pid%3DApi&sp=1746633499T5c8a65638ea8d514adc265f7f2f326c050b732e7ce20ae978ac77304851a0231",
  },
];

const FeedPage = () => {
  const [commentBoxes, setCommentBoxes] = useState({});
  const [comments, setComments] = useState({});

  const toggleCommentBox = (postId) => {
    setCommentBoxes((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    alert(`Comment for Post ${postId}: ${comments[postId]}`);
    setComments((prev) => ({ ...prev, [postId]: "" }));
    setCommentBoxes((prev) => ({ ...prev, [postId]: false }));
  };

  return (
    <Container className="my-4">
      {posts.map((post) => (
        <Card key={post.id} className="mb-4 shadow">
          <Card.Body>
            <div className="d-flex align-items-center mb-2">
              <Image
                src={post.user.avatar}
                roundedCircle
                width={50}
                height={50}
                className="me-3"
              />
              <div>
                <h6 className="mb-0">{post.user.name}</h6>
                <small className="text-muted">{post.user.role}</small>
              </div>
              {post.user.isVerified && (
                <span className="badge bg-warning text-dark ms-auto">Featured</span>
              )}
            </div>
            <Card.Text>{post.content}</Card.Text>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="img-fluid rounded mb-3"
              />
            )}
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-secondary" size="sm">
                <FaRegHeart /> Like
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => toggleCommentBox(post.id)}
              >
                <FaRegCommentDots /> Comment
              </Button>
              <Button variant="outline-secondary" size="sm">
                <FaShareAlt /> Share
              </Button>
            </div>
            {commentBoxes[post.id] && (
              <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Write a comment..."
                    value={comments[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                  />
                </Form.Group>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default FeedPage;
