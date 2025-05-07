package com.paf.cookMate.Dto;

import lombok.Data;
import java.util.List;

@Data

public class PostRequest {
    private String description;
    private List<String> mediaUrls;
    
}
