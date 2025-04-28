import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Spinner, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const UserSearch = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    setQuery(searchQuery);

    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    }
  }, [location.search]);

  const searchUsers = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/users/search?query=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchUsers(query);
  };

  const handleFollow = async (targetId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/follow/${targetId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSearchResults(prev =>
        prev.map(u => u._id === targetId ? { ...u, isFollowing: true } : u)
      );
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/unfollow/${targetId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSearchResults(prev =>
        prev.map(u => u._id === targetId ? { ...u, isFollowing: false } : u)
      );
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  return (
    <div className="my-4">
      <Form className="d-flex" onSubmit={handleSearch}>
        <Form.Control
          type="search"
          placeholder="Search users..."
          className="me-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">Search</Button>
      </Form>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}

      <Row className="mt-4">
        {searchResults.length === 0 && !loading && query && (
          <p className="text-muted text-center">No users found.</p>
        )}

        {searchResults.map((u) => (
          <Col md={4} key={u._id} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Image
                  src={u.profileImage || "/assets/av.avif"}
                  roundedCircle
                  width={60}
                  height={60}
                  className="mb-3"
                />
                <Card.Title>{u.name}</Card.Title>
                <Card.Text className="text-muted">{u.email}</Card.Text>
                {u._id === user._id ? (
                  <Button variant="secondary" disabled>Your Profile</Button>
                ) : u.isFollowing ? (
                  <Button variant="outline-danger" size="sm" onClick={() => handleUnfollow(u._id)}>Unfollow</Button>
                ) : (
                  <Button variant="outline-success" size="sm" onClick={() => handleFollow(u._id)}>Follow</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserSearch;
