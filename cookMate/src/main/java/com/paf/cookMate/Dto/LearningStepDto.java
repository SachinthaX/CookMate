package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningStepDto {
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