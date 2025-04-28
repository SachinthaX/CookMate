package com.cookmate.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private String avatarUrl;
    private String bio;
    private String role;
    private Instant createdAt;

    @Builder.Default
    private List<String> followers = new ArrayList<>();

    @Builder.Default
    private List<String> following = new ArrayList<>();

}
