package com.cookmate.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private String description;
    private List<String> mediaUrls;  // URLs of images/videos (optional at start)
}