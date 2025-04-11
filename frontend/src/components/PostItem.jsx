import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { deletePost } from '../services/api';
import PostForm from './PostForm';
import { Link } from 'react-router-dom';

const PostItem = ({ post, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      onUpdate();
    } catch (err) {
      setError(err);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Subtitle className="text-muted">
            Posted by <Link to={`/profile/${post.userId}`}>{post.userId}</Link>
          </Card.Subtitle>
          <div>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setShowEditModal(true)}
              className="me-2"
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <Card.Text>{post.description}</Card.Text>

        <div className="media-grid">
          {post.media?.map((media, index) => (
            media.fileType.startsWith('image') ? (
              <img
                key={index}
                src={media.url}
                alt={`Post media ${index}`}
                className="img-thumbnail"
              />
            ) : (
              <video key={index} controls className="w-100">
                <source src={media.url} type={media.fileType} />
              </video>
            )
          ))}
        </div>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PostForm 
              postId={post.id} 
              onSuccess={() => {
                onUpdate();
                setShowEditModal(false);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation */}
        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this post?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default PostItem;