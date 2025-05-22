package com.paf.cookMate.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String profilePicture;

    private String bio;
    private String phoneNumber;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean active = true;

    // 👇 New fields for social login and follow system
    private String provider = "local"; // local, google, facebook

    private List<String> followers = new ArrayList<>();

    private List<String> following = new ArrayList<>();
} 
