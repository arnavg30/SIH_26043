package com.sih.portal.controller;

import com.sih.portal.entity.ProblemMedia;
import com.sih.portal.service.ProblemMediaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problem-media")
public class ProblemMediaController {

    private final ProblemMediaService problemMediaService;

    public ProblemMediaController(ProblemMediaService problemMediaService) {
        this.problemMediaService = problemMediaService;
    }

    @PostMapping
    public ResponseEntity<ProblemMedia> createProblemMedia(
            @RequestBody ProblemMedia problemMedia) {

        ProblemMedia createdProblemMedia =
                problemMediaService.createProblemMedia(problemMedia);

        return ResponseEntity.ok(createdProblemMedia);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemMedia> getProblemMediaById(
            @PathVariable Long id) {

        return problemMediaService.getProblemMediaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}