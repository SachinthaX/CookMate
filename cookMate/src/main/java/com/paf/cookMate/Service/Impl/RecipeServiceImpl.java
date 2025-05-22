package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.RecipeDto;
import com.paf.cookMate.Model.Recipe;
import com.paf.cookMate.Repository.RecipeRepository;
import com.paf.cookMate.Service.RecipeService;
import com.paf.cookMate.Exception.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeServiceImpl implements RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public RecipeDto createRecipe(RecipeDto recipeDto) {
        Recipe recipe = convertToEntity(recipeDto);
        Recipe savedRecipe = recipeRepository.save(recipe);
        return convertToDto(savedRecipe);
    }

    @Override
    public RecipeDto getRecipeById(String id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));
        return convertToDto(recipe);
    }

    @Override
    public List<RecipeDto> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();
        return recipes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDto> getRecipesByUser(String userId) {
        List<Recipe> recipes = recipeRepository.findByCreatedBy(userId);
        return recipes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDto> searchRecipes(String keyword) {
        List<Recipe> recipes = recipeRepository.findByTitleContainingIgnoreCase(keyword);
        return recipes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RecipeDto> getRecipesByTag(String tag) {
        List<Recipe> recipes = recipeRepository.findByTagsContaining(tag);
        return recipes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public RecipeDto updateRecipe(String id, RecipeDto recipeDto) {
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));
        
        // Update existingRecipe fields with recipeDto values
        BeanUtils.copyProperties(recipeDto, existingRecipe, "id");
        
        Recipe updatedRecipe = recipeRepository.save(existingRecipe);
        return convertToDto(updatedRecipe);
    }

    @Override
    public void deleteRecipe(String id) {
        if (!recipeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recipe", "id", id);
        }
        recipeRepository.deleteById(id);
    }

    // Helper methods for DTO conversion
    private Recipe convertToEntity(RecipeDto recipeDto) {
        Recipe recipe = new Recipe();
        BeanUtils.copyProperties(recipeDto, recipe);
        return recipe;
    }

    private RecipeDto convertToDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        BeanUtils.copyProperties(recipe, recipeDto);
        return recipeDto;
    }
} 