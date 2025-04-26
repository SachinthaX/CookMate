package com.paf.cookMate.Bootstrap;

import com.paf.cookMate.Model.Recipe;
import com.paf.cookMate.Repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;

@Component
public class DataInitializer {

    @Autowired
    private RecipeRepository recipeRepository;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Count existing recipes
            long recipesCount = recipeRepository.count();
            
            if (recipesCount == 0) {
                System.out.println("Initializing database with sample data...");
                
                // Create a sample recipe
                Recipe sampleRecipe = new Recipe();
                sampleRecipe.setTitle("Simple Pasta");
                sampleRecipe.setDescription("A quick and easy pasta recipe");
                sampleRecipe.setIngredients(Arrays.asList(
                    "200g pasta", 
                    "2 tablespoons olive oil", 
                    "2 cloves garlic", 
                    "Salt and pepper to taste"));
                sampleRecipe.setInstructions(Arrays.asList(
                    "Boil water in a large pot", 
                    "Add salt and pasta to boiling water", 
                    "Cook for 8-10 minutes until al dente", 
                    "Drain and toss with olive oil and minced garlic", 
                    "Season with salt and pepper"));
                sampleRecipe.setCreatedBy("system");
                sampleRecipe.setDifficulty("Easy");
                sampleRecipe.setPreparationTimeMinutes(5);
                sampleRecipe.setCookingTimeMinutes(10);
                sampleRecipe.setServings(2);
                sampleRecipe.setTags(Arrays.asList("pasta", "easy", "quick", "beginner"));
                
                // Save to database
                recipeRepository.save(sampleRecipe);
                System.out.println("Sample recipe saved to database with ID: " + sampleRecipe.getId());
            } else {
                System.out.println("Database already contains data. Found " + recipesCount + " recipes.");
            }
        };
    }
} 