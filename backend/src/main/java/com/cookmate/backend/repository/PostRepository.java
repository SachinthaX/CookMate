package com.cookmate.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cookmate.backend.model.Post;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId); // Find posts by user
}