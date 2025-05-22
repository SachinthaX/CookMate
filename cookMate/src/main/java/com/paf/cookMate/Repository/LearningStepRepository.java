package com.paf.cookMate.Repository;

import com.paf.cookMate.Model.LearningStep;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningStepRepository extends MongoRepository<LearningStep, String> {
    List<LearningStep> findByLearningPlanId(String learningPlanId);
    void deleteByLearningPlanId(String learningPlanId);
} 