package com.paf.cookMate.Service.Impl;

import com.paf.cookMate.Dto.LearningPlanDto;
import com.paf.cookMate.Dto.LearningStepDto;
import com.paf.cookMate.Model.LearningPlan;
import com.paf.cookMate.Model.LearningStep;
import com.paf.cookMate.Repository.LearningPlanRepository;
import com.paf.cookMate.Repository.LearningStepRepository;
import com.paf.cookMate.Service.LearningPlanService;
import com.paf.cookMate.Exception.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private LearningStepRepository learningStepRepository;

    @Override
    @Transactional
    public LearningPlanDto createLearningPlan(LearningPlanDto learningPlanDto) {
        LearningPlan learningPlan = new LearningPlan();
        BeanUtils.copyProperties(learningPlanDto, learningPlan, "steps");
        
        learningPlan.setSteps(new ArrayList<>());
        
        LearningPlan savedLearningPlan = learningPlanRepository.save(learningPlan);
        
        // Then save each step with a reference to the learning plan
        if (learningPlanDto.getSteps() != null && !learningPlanDto.getSteps().isEmpty()) {
            List<LearningStep> steps = learningPlanDto.getSteps().stream()
                    .map(stepDto -> {
                        LearningStep step = new LearningStep();
                        BeanUtils.copyProperties(stepDto, step);
                        step.setLearningPlanId(savedLearningPlan.getId());
                        return step;
                    })
                    .collect(Collectors.toList());
            
            List<LearningStep> savedSteps = learningStepRepository.saveAll(steps);
            savedLearningPlan.setSteps(savedSteps);
        }
        
        return convertToDto(savedLearningPlan);
    }

    @Override
    public LearningPlanDto getLearningPlanById(String id) {
        LearningPlan learningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Plan", "id", id));
        
        // Fetch the steps for this learning plan
        List<LearningStep> steps = learningStepRepository.findByLearningPlanId(id);
        learningPlan.setSteps(steps);
        
        return convertToDto(learningPlan);
    }

    @Override
    public List<LearningPlanDto> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanRepository.findAll();
        
        // For each learning plan, fetch its steps
        learningPlans.forEach(plan -> {
            List<LearningStep> steps = learningStepRepository.findByLearningPlanId(plan.getId());
            plan.setSteps(steps);
        });
        
        return learningPlans.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LearningPlanDto> getLearningPlansByUser(String userId) {
        List<LearningPlan> learningPlans = learningPlanRepository.findByUserId(userId);
        
        // For each learning plan, fetch its steps
        learningPlans.forEach(plan -> {
            List<LearningStep> steps = learningStepRepository.findByLearningPlanId(plan.getId());
            plan.setSteps(steps);
        });
        
        return learningPlans.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LearningPlanDto> getLearningPlansByUserAndCompletionStatus(String userId, boolean completed) {
        List<LearningPlan> learningPlans = learningPlanRepository.findByUserIdAndCompleted(userId, completed);
        
        // For each learning plan, fetch its steps
        learningPlans.forEach(plan -> {
            List<LearningStep> steps = learningStepRepository.findByLearningPlanId(plan.getId());
            plan.setSteps(steps);
        });
        
        return learningPlans.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LearningPlanDto updateLearningPlan(String id, LearningPlanDto learningPlanDto) {
        LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Plan", "id", id));
        
        BeanUtils.copyProperties(learningPlanDto, existingLearningPlan, "id", "steps");
        
        LearningPlan updatedLearningPlan = learningPlanRepository.save(existingLearningPlan);
        
        if (learningPlanDto.getSteps() != null) {
            learningStepRepository.deleteByLearningPlanId(id);
            
            List<LearningStep> newSteps = learningPlanDto.getSteps().stream()
                    .map(stepDto -> {
                        LearningStep step = new LearningStep();
                        BeanUtils.copyProperties(stepDto, step);
                        step.setLearningPlanId(id);
                        return step;
                    })
                    .collect(Collectors.toList());
            
            List<LearningStep> savedSteps = learningStepRepository.saveAll(newSteps);
            updatedLearningPlan.setSteps(savedSteps);
        } else {
            List<LearningStep> steps = learningStepRepository.findByLearningPlanId(id);
            updatedLearningPlan.setSteps(steps);
        }
        
        return convertToDto(updatedLearningPlan);
    }

    @Override
    public LearningPlanDto updateLearningPlanProgress(String id, int progress) {
        LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning Plan", "id", id));
        
        existingLearningPlan.setProgress(progress);
        
        // Auto-mark as completed if progress reaches 100%
        if (progress >= 100) {
            existingLearningPlan.setCompleted(true);
        }
        
        LearningPlan updatedLearningPlan = learningPlanRepository.save(existingLearningPlan);
        
        // Fetch steps for the response
        List<LearningStep> steps = learningStepRepository.findByLearningPlanId(id);
        updatedLearningPlan.setSteps(steps);
        
        return convertToDto(updatedLearningPlan);
    }

    @Override
    @Transactional
    public void deleteLearningPlan(String id) {
        if (!learningPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning Plan", "id", id);
        }
        
        // First delete all steps associated with this learning plan
        learningStepRepository.deleteByLearningPlanId(id);
        
        // Then delete the learning plan
        learningPlanRepository.deleteById(id);
    }

    // Helper methods for DTO conversion
    private LearningPlanDto convertToDto(LearningPlan entity) {
        LearningPlanDto dto = new LearningPlanDto();
        BeanUtils.copyProperties(entity, dto, "steps");
        
        // Handle steps conversion
        if (entity.getSteps() != null) {
            List<LearningStepDto> stepDtos = entity.getSteps().stream()
                    .map(step -> {
                        LearningStepDto stepDto = new LearningStepDto();
                        BeanUtils.copyProperties(step, stepDto);
                        return stepDto;
                    })
                    .collect(Collectors.toList());
            dto.setSteps(stepDtos);
        } else {
            dto.setSteps(new ArrayList<>());
        }
        
        return dto;
    }
} 