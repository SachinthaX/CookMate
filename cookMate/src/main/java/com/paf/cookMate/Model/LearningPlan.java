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
@Document(collection = "learning_plans")
public class LearningPlan {
    
    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private List<LearningStep> steps;
    private boolean completed;
    private int progress;
    private String level;
    private String category;
    private String duration;
    private int hoursPerWeek;
    private List<String> requirements;
    private int enrolled;
    private String postcoverurl;
} 