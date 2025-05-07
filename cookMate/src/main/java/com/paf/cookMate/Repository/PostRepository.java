package com.paf.cookMate.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf.cookMate.Model.Post;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId); // Find posts by user
}
