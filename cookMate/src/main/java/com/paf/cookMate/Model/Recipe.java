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
@Document(collection = "recipes")
public class Recipe {
    
    @Id
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