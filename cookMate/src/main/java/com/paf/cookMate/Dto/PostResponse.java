package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PostResponse {

    private String id;

    private String userId;

    private String description;

    private List<String> mediaUrls;

    private List<String> likes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
}
