package com.paf.cookMate.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Comment {

    @Id
    private String id;

    private String postId;     // Link to Post
    private String userId;     // Who commented
    private String text;       // Comment text
    private LocalDateTime createdAt;
}
    

