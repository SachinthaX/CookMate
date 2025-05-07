package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String password; // Only used for registration/login requests
    private String profilePicture;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
} 