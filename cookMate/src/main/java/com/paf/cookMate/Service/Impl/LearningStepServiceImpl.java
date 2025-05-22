package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.LearningStepDto;
import com.paf.cookMate.Model.LearningStep;
import com.paf.cookMate.Repository.LearningStepRepository;
import com.paf.cookMate.Service.LearningStepService;
import com.paf.cookMate.Exception.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningStepServiceImpl implements LearningStepService {

    @Autowired
    private LearningStepRepository learningStepRepository;

    @Override
    public LearningStepDto createLearningStep(LearningStepDto learningStepDto) {
        LearningStep learningStep = convertToEntity(learningStepDto);
        LearningStep savedLearningStep = learningStepRepository.save(learningStep);
        return convertToDto(savedLearningStep);
    }

    @Override
    public LearningStepDto getLearningStepById(String id) {
        LearningStep learningStep = learningStepRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Step", "id", id));
        return convertToDto(learningStep);
    }

    @Override
    public List<LearningStepDto> getLearningStepsByPlanId(String planId) {
        List<LearningStep> learningSteps = learningStepRepository.findByLearningPlanId(planId);
        return learningSteps.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LearningStepDto updateLearningStep(String id, LearningStepDto learningStepDto) {
        LearningStep existingLearningStep = learningStepRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Step", "id", id));
        
        // Preserve the ID and learning plan ID
        String learningPlanId = existingLearningStep.getLearningPlanId();
        BeanUtils.copyProperties(learningStepDto, existingLearningStep, "id");
        existingLearningStep.setLearningPlanId(learningPlanId);
        
        LearningStep updatedLearningStep = learningStepRepository.save(existingLearningStep);
        return convertToDto(updatedLearningStep);
    }

    @Override
    public LearningStepDto updateLearningStepCompletion(String id, boolean completed) {
        LearningStep existingLearningStep = learningStepRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Step", "id", id));
        
        existingLearningStep.setCompleted(completed);
        LearningStep updatedLearningStep = learningStepRepository.save(existingLearningStep);
        return convertToDto(updatedLearningStep);
    }

    @Override
    public void deleteLearningStep(String id) {
        if (!learningStepRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning Step", "id", id);
        }
        learningStepRepository.deleteById(id);
    }

    // Helper methods for DTO conversion
    private LearningStep convertToEntity(LearningStepDto dto) {
        LearningStep entity = new LearningStep();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    private LearningStepDto convertToDto(LearningStep entity) {
        LearningStepDto dto = new LearningStepDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
} 