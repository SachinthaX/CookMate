package com.paf.cookMate.Service;

import com.paf.cookMate.Dto.LearningPlanDto;

import java.util.List;

public interface LearningPlanService {
    LearningPlanDto createLearningPlan(LearningPlanDto learningPlanDto);
    LearningPlanDto getLearningPlanById(String id);
    List<LearningPlanDto> getAllLearningPlans();
    List<LearningPlanDto> getLearningPlansByUser(String userId);
    List<LearningPlanDto> getLearningPlansByUserAndCompletionStatus(String userId, boolean completed);
    LearningPlanDto updateLearningPlan(String id, LearningPlanDto learningPlanDto);
    LearningPlanDto updateLearningPlanProgress(String id, int progress);
    void deleteLearningPlan(String id);
} 