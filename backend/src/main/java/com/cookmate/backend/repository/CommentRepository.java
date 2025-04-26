// src/main/java/com/cookmate/backend/repository/CommentRepository.java

package com.cookmate.backend.repository;

import com.cookmate.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
