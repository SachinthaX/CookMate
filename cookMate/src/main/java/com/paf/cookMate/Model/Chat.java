package com.paf.cookMate.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chats")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chat {
    @Id
    private String id;
    private String userId;
    private String prompt;
    private String aiResponse;
    private LocalDateTime createdAt;
}
