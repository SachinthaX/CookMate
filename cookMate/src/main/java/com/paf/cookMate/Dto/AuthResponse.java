package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String name;
    private String email;
    private String profilePicture;
    private String sessionId;
    private String token;
    private boolean success;
    private String message;
} 