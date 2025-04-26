import { useState } from 'react';
import { createPost } from '../services/postService';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState(['']);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredMediaUrls = mediaUrls.filter((url) => url.trim() !== '');

    try {
      await createPost({ description, mediaUrls: filteredMediaUrls });
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post', error);
      alert('Failed to create post');
    }
  };

  const handleMediaUrlChange = (index, value) => {
    const newMediaUrls = [...mediaUrls];
    newMediaUrls[index] = value;
    setMediaUrls(newMediaUrls);
  };

  const addMoreMediaInput = () => {
    if (mediaUrls.length < 3) {
      setMediaUrls([...mediaUrls, '']);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
          />
        </div>

        {mediaUrls.map((url, index) => (
          <div className="mb-3" key={index}>
            <label>Media URL {index + 1}</label>
            <input
              type="url"
              className="form-control"
              value={url}
              onChange={(e) => handleMediaUrlChange(index, e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ))}

        {mediaUrls.length < 3 && (
          <button type="button" className="btn btn-secondary mb-3" onClick={addMoreMediaInput}>
            Add Another Media URL
          </button>
        )}

        <div>
          <button type="submit" className="btn btn-primary">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}
