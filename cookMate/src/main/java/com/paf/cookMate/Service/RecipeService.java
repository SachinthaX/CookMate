package com.paf.cookMate.Service;

import com.paf.cookMate.Dto.RecipeDto;

import java.util.List;

public interface RecipeService {
    RecipeDto createRecipe(RecipeDto recipeDto);
    RecipeDto getRecipeById(String id);
    List<RecipeDto> getAllRecipes();
    List<RecipeDto> getRecipesByUser(String userId);
    List<RecipeDto> searchRecipes(String keyword);
    List<RecipeDto> getRecipesByTag(String tag);
    RecipeDto updateRecipe(String id, RecipeDto recipeDto);
    void deleteRecipe(String id);
} 