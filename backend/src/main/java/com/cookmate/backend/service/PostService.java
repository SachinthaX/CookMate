package com.cookmate.backend.service;

import com.cookmate.backend.dto.PostRequest;
import com.cookmate.backend.dto.PostResponse;
import com.cookmate.backend.exception.PostNotFoundException;
import com.cookmate.backend.model.Media;
import com.cookmate.backend.model.Post;
import com.cookmate.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Added for logging
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j // Added for logging
public class PostService {

    private final PostRepository postRepository;
    private final Path rootLocation = Paths.get("uploads");

    public PostResponse createPost(PostRequest request) throws IOException {
        try {
            validateMediaFiles(request.getMediaFiles());
            ensureUploadsDirectoryExists();

            Post post = new Post();
            post.setDescription(request.getDescription());
            post.setUserId("temp-user");
            post.setCreatedAt(LocalDateTime.now());
            post.setMedia(processMediaFiles(request.getMediaFiles()));

            Post savedPost = postRepository.save(post);
            return mapToResponse(savedPost);
        } catch (IOException | IllegalArgumentException e) {
            log.error("Post creation failed: {}", e.getMessage());
            throw e; // Re-throw to be handled by controller
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
            throw new RuntimeException("Failed to create post: " + e.getMessage());
        }
    }

    public PostResponse getPost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));
        return mapToResponse(post);
    }

    public PostResponse updatePost(String id, PostRequest request) throws IOException {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        validateMediaFiles(request.getMediaFiles());
        ensureUploadsDirectoryExists();

        existingPost.setDescription(request.getDescription());
        existingPost.setUpdatedAt(LocalDateTime.now());
        existingPost.setMedia(processMediaFiles(request.getMediaFiles()));

        Post updatedPost = postRepository.save(existingPost);
        return mapToResponse(updatedPost);
    }

    public void deletePost(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));
        postRepository.delete(post);
    }

    private List<Media> processMediaFiles(List<MultipartFile> files) throws IOException {
        List<Media> mediaList = new ArrayList<>();
        
        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = rootLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            
            Media media = new Media();
            media.setFileName(file.getOriginalFilename());
            media.setFileType(file.getContentType());
            media.setFilePath(targetLocation.toString());
            
            if (file.getContentType() != null && file.getContentType().startsWith("video")) {
                media.setDuration(getVideoDuration(file));
            }
            
            mediaList.add(media);
        }
        return mediaList;
    }

    private void validateMediaFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one media file is required");
        }
        
        if (files.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 media files allowed");
        }

        files.forEach(file -> {
            if (file.getContentType() == null) {
                throw new IllegalArgumentException("Invalid file type");
            }
            if (file.getContentType().startsWith("video") && !isValidVideoDuration(file)) {
                throw new IllegalArgumentException("Video exceeds 30-second limit");
            }
        });
    }

    private boolean isValidVideoDuration(MultipartFile file) {
        return getVideoDuration(file) <= 30;
    }

    private long getVideoDuration(MultipartFile file) {
        // FFmpeg integration placeholder
        return 0;
    }

    private PostResponse mapToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setDescription(post.getDescription());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        
        List<PostResponse.MediaResponse> mediaResponses = new ArrayList<>();
        for (Media media : post.getMedia()) {
            PostResponse.MediaResponse mr = new PostResponse.MediaResponse();
            mr.setFileName(media.getFileName());
            mr.setFileType(media.getFileType());
            mr.setUrl("/uploads/" + media.getFileName());
            mr.setDuration(media.getDuration());
            mediaResponses.add(mr);
        }
        
        response.setMedia(mediaResponses);
        return response;
    }

    private void ensureUploadsDirectoryExists() throws IOException {
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }
    }
}