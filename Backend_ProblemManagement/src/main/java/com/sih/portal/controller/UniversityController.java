package com.sih.portal.controller;

import com.sih.portal.entity.University;
import com.sih.portal.service.UniversityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @PostMapping
    public ResponseEntity<University> createUniversity(
            @RequestBody University university) {

        University createdUniversity =
                universityService.createUniversity(university);

        return ResponseEntity.ok(createdUniversity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(
            @PathVariable Long id) {

        return universityService.getUniversityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}