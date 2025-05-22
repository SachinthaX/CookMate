package com.paf.cookMate.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {
    private String id;
    private String title;
    private String description;
    private List<String> ingredients;
    private List<String> instructions;
    private String createdBy;
    private String imageUrl;
    private int preparationTimeMinutes;
    private int cookingTimeMinutes;
    private int servings;
    private String difficulty;
    private List<String> tags;
} 