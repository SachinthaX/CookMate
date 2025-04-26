package com.cookmate.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;

    private String userId;  // Who created the post
    private String description;
    private List<String> mediaUrls; // URLs to photos/videos
    private List<String> likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}