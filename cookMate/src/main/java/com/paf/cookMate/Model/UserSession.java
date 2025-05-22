package com.paf.cookMate.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_sessions")
public class UserSession {

    @Id
    private String id;

    private String userId;

    private String sessionId;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    private boolean active = true;
}
