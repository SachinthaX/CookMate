package com.cookmate.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String description;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Media> media;
}