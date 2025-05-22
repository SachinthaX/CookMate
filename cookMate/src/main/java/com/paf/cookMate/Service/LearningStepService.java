package com.paf.cookMate.Service;

import com.paf.cookMate.Dto.LearningStepDto;

import java.util.List;

public interface LearningStepService {
    LearningStepDto createLearningStep(LearningStepDto learningStepDto);
    LearningStepDto getLearningStepById(String id);
    List<LearningStepDto> getLearningStepsByPlanId(String planId);
    LearningStepDto updateLearningStep(String id, LearningStepDto learningStepDto);
    LearningStepDto updateLearningStepCompletion(String id, boolean completed);
    void deleteLearningStep(String id);
} 