package com.cookmate.backend.model;

import lombok.Data;

@Data
public class Media {
    private String fileName;
    private String fileType;
    private String filePath;
    private long duration;
}