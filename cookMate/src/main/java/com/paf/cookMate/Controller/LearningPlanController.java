package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.LearningPlanDto;
import com.paf.cookMate.Service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping
    public ResponseEntity<LearningPlanDto> createLearningPlan(@RequestBody LearningPlanDto learningPlanDto) {
        LearningPlanDto createdLearningPlan = learningPlanService.createLearningPlan(learningPlanDto);
        return new ResponseEntity<>(createdLearningPlan, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanDto> getLearningPlanById(@PathVariable String id) {
        LearningPlanDto learningPlan = learningPlanService.getLearningPlanById(id);
        return ResponseEntity.ok(learningPlan);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlanDto>> getAllLearningPlans() {
        List<LearningPlanDto> learningPlans = learningPlanService.getAllLearningPlans();
        return ResponseEntity.ok(learningPlans);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlanDto>> getLearningPlansByUser(@PathVariable String userId) {
        List<LearningPlanDto> learningPlans = learningPlanService.getLearningPlansByUser(userId);
        return ResponseEntity.ok(learningPlans);
    }

    @GetMapping("/user/{userId}/status")
    public ResponseEntity<List<LearningPlanDto>> getLearningPlansByUserAndStatus(
            @PathVariable String userId,
            @RequestParam boolean completed) {
        List<LearningPlanDto> learningPlans = learningPlanService.getLearningPlansByUserAndCompletionStatus(userId, completed);
        return ResponseEntity.ok(learningPlans);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanDto> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlanDto learningPlanDto) {
        LearningPlanDto updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlanDto);
        return ResponseEntity.ok(updatedLearningPlan);
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<LearningPlanDto> updateLearningPlanProgress(
            @PathVariable String id,
            @RequestParam int progress) {
        LearningPlanDto updatedLearningPlan = learningPlanService.updateLearningPlanProgress(id, progress);
        return ResponseEntity.ok(updatedLearningPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        learningPlanService.deleteLearningPlan(id);
        return ResponseEntity.noContent().build();
    }
} 