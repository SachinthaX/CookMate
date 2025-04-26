package com.cookmate.backend.service;

import com.cookmate.backend.dto.PostRequest;
import com.cookmate.backend.dto.PostResponse;
import com.cookmate.backend.model.Comment;
import com.cookmate.backend.model.Post;
import com.cookmate.backend.repository.CommentRepository;
import com.cookmate.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    //  Create Post
    public PostResponse createPost(String userId, PostRequest request) {
        Post post = Post.builder()
                .userId(userId)
                .description(request.getDescription())
                .mediaUrls(request.getMediaUrls())
                .likes(new java.util.ArrayList<>()) // Always initialize empty likes list
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    //  Get All Posts
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //  Get Single Post
    public PostResponse getPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToResponse(post);
    }

    //  Update Post
    public PostResponse updatePost(String id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setDescription(request.getDescription());
        post.setMediaUrls(request.getMediaUrls());
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);
        return mapToResponse(updatedPost);
    }

    //  Delete Post
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    //  Like/Unlike Post
    public PostResponse likeOrUnlikePost(String postId, String userId) {
    Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

    if (post.getLikes() == null) {
        post.setLikes(new ArrayList<>());
    }

    String cleanedUserId = userId.trim();

    if (post.getLikes().contains(cleanedUserId)) {
        post.getLikes().remove(cleanedUserId); // Unlike
    } else {
        post.getLikes().add(cleanedUserId); // Like
    }

    Post updatedPost = postRepository.save(post);
    return mapToResponse(updatedPost);
}


    //  Add Comment to Post
    public Comment addComment(String postId, String userId, String text) {
        Comment comment = Comment.builder()
                .postId(postId)
                .userId(userId)
                .text(text)
                .createdAt(LocalDateTime.now())
                .build();
        return commentRepository.save(comment);
    }

    //  Get Comments for Post
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    //  Map Post -> PostResponse
    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .description(post.getDescription())
                .mediaUrls(post.getMediaUrls())
                .likes(post.getLikes())  // ✅ Include likes in response
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
