package com.sih.portal.controller;

import com.sih.portal.dto.problem.ProblemRequest;
import com.sih.portal.dto.problem.ProblemResponse;
import com.sih.portal.dto.problem.ProblemStatusRequest;
import com.sih.portal.service.ProblemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // CREATE PROBLEM
    @PostMapping
    public ResponseEntity<ProblemResponse> createProblem(
            @RequestBody ProblemRequest request) {

        ProblemResponse response =
                problemService.createProblem(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // GET ALL PROBLEMS
    @GetMapping
    public ResponseEntity<List<ProblemResponse>> getAllProblems() {

        return ResponseEntity.ok(
                problemService.getAllProblems()
        );
    }

    // GET PROBLEM BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProblemResponse> getProblemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                problemService.getProblemById(id)
        );
    }

    // UPDATE PROBLEM
    @PutMapping("/{id}")
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @RequestBody ProblemRequest request) {

        return ResponseEntity.ok(
                problemService.updateProblem(id, request)
        );
    }

    // DELETE PROBLEM
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProblem(
            @PathVariable Long id) {

        problemService.deleteProblem(id);

        return ResponseEntity.ok(
                "Problem deleted successfully"
        );
    }

    // UPDATE PROBLEM STATUS
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProblemResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody ProblemStatusRequest request) {

        return ResponseEntity.ok(
                problemService.updateStatus(id, request)
        );
    }

    // GET PROBLEMS BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProblemResponse>> getProblemsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                problemService.getProblemsByStatus(status)
        );
    }

    // GET PROBLEMS BY CATEGORY
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProblemResponse>> getProblemsByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                problemService.getProblemsByCategory(categoryId)
        );
    }

    // GET DUPLICATE REPORTS
    @GetMapping("/{id}/duplicates")
    public ResponseEntity<List<ProblemResponse>> getDuplicateReports(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                problemService.getDuplicateReports(id)
        );
    }

    // GET DUPLICATE REPORT COUNT
    @GetMapping("/{id}/duplicate-count")
    public ResponseEntity<Long> getDuplicateReportCount(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                problemService.getDuplicateReportCount(id)
        );
    }
}