package com.cookmate.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private String id;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MediaResponse> media;

    @Data
    public static class MediaResponse {
        private String fileName;
        private String fileType;
        private String url;
        private long duration;
    }
}