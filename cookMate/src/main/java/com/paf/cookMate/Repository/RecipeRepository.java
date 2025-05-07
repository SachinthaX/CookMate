package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByCreatedBy(String userId);
    List<Recipe> findByTitleContainingIgnoreCase(String keyword);
    List<Recipe> findByTagsContaining(String tag);
} 