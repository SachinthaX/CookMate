package com.paf.cookMate.Controller;

import com.paf.cookMate.Dto.LearningStepDto;
import com.paf.cookMate.Service.LearningStepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-steps")
@CrossOrigin
public class LearningStepController {

    @Autowired
    private LearningStepService learningStepService;

    @PostMapping
    public ResponseEntity<LearningStepDto> createLearningStep(@RequestBody LearningStepDto learningStepDto) {
        LearningStepDto createdLearningStep = learningStepService.createLearningStep(learningStepDto);
        return new ResponseEntity<>(createdLearningStep, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningStepDto> getLearningStepById(@PathVariable String id) {
        LearningStepDto learningStep = learningStepService.getLearningStepById(id);
        return ResponseEntity.ok(learningStep);
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<LearningStepDto>> getLearningStepsByPlanId(@PathVariable String planId) {
        List<LearningStepDto> learningSteps = learningStepService.getLearningStepsByPlanId(planId);
        return ResponseEntity.ok(learningSteps);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningStepDto> updateLearningStep(
            @PathVariable String id,
            @RequestBody LearningStepDto learningStepDto) {
        LearningStepDto updatedLearningStep = learningStepService.updateLearningStep(id, learningStepDto);
        return ResponseEntity.ok(updatedLearningStep);
    }

    @PatchMapping("/{id}/completion")
    public ResponseEntity<LearningStepDto> updateLearningStepCompletion(
            @PathVariable String id,
            @RequestParam boolean completed) {
        LearningStepDto updatedLearningStep = learningStepService.updateLearningStepCompletion(id, completed);
        return ResponseEntity.ok(updatedLearningStep);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningStep(@PathVariable String id) {
        learningStepService.deleteLearningStep(id);
        return ResponseEntity.noContent().build();
    }
} 