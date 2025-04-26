package com.cookmate.backend.controller;

import com.cookmate.backend.dto.PostRequest;
import com.cookmate.backend.dto.PostResponse;
import com.cookmate.backend.model.Comment;
import com.cookmate.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    //  Create a new post
    @PostMapping
    public PostResponse createPost(@RequestBody PostRequest postRequest) {
        String userId = "dummy-user-id"; // TODO: Later fetch from JWT/Session
        return postService.createPost(userId, postRequest);
    }

    //  Get all posts
    @GetMapping
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }

    //  Get post by ID
    @GetMapping("/{id}")
    public PostResponse getPostById(@PathVariable String id) {
        return postService.getPostById(id);
    }

    //  Update post
    @PutMapping("/{id}")
    public PostResponse updatePost(@PathVariable String id, @RequestBody PostRequest postRequest) {
        return postService.updatePost(id, postRequest);
    }

    //  Delete post
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id) {
        postService.deletePost(id);
    }

    //  Like/Unlike a post
    @PostMapping("/{id}/like")
    public PostResponse likeOrUnlikePost(@PathVariable String id, @RequestParam String userId) {
        return postService.likeOrUnlikePost(id, userId);
    }

    //  Add a comment to a post
    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable String id,
                               @RequestParam String userId,
                               @RequestParam String text) {
        return postService.addComment(id, userId, text);
    }

    //  Get all comments of a post
    @GetMapping("/{id}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable String id) {
        return postService.getCommentsByPostId(id);
    }
}
