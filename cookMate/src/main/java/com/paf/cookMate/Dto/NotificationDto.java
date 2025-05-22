package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String id;
    private String userId;
    private String senderId;
    private String type;
    private String message;
    private String resourceId;
    private String resourceType;
    private boolean read;
    private LocalDateTime createdAt;
} 