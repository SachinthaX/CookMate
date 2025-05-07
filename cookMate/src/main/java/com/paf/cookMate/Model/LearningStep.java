package com.paf.cookMate.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "learning_steps")
public class LearningStep {
    @Id
    private String id;
    private String title;
    private String description;
    private boolean completed;
    private List<String> resources;
    private String learningPlanId;
    private String type;
    private String duration;
    private int order;
} 