package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.RecipeDto;
import com.paf.cookMate.Service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeDto recipeDto) {
        RecipeDto createdRecipe = recipeService.createRecipe(recipeDto);
        return new ResponseEntity<>(createdRecipe, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable String id) {
        RecipeDto recipe = recipeService.getRecipeById(id);
        return ResponseEntity.ok(recipe);
    }

    @GetMapping
    public ResponseEntity<List<RecipeDto>> getAllRecipes() {
        List<RecipeDto> recipes = recipeService.getAllRecipes();
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipeDto>> getRecipesByUser(@PathVariable String userId) {
        List<RecipeDto> recipes = recipeService.getRecipesByUser(userId);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDto>> searchRecipes(@RequestParam String keyword) {
        List<RecipeDto> recipes = recipeService.searchRecipes(keyword);
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<RecipeDto>> getRecipesByTag(@PathVariable String tag) {
        List<RecipeDto> recipes = recipeService.getRecipesByTag(tag);
        return ResponseEntity.ok(recipes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDto> updateRecipe(@PathVariable String id, @RequestBody RecipeDto recipeDto) {
        RecipeDto updatedRecipe = recipeService.updateRecipe(id, recipeDto);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }
} 