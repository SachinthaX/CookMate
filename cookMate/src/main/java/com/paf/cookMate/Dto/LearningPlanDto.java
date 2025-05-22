package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlanDto {
    private String id;
    private String title;
    private String description;
    private String userId;
    private List<LearningStepDto> steps;
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