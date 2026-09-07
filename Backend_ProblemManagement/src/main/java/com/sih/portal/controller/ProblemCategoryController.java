package com.sih.portal.controller;

import com.sih.portal.entity.ProblemCategory;
import com.sih.portal.service.ProblemCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problem-categories")
@CrossOrigin(origins = "*")
public class ProblemCategoryController {

    private final ProblemCategoryService problemCategoryService;

    public ProblemCategoryController(
            ProblemCategoryService problemCategoryService) {

        this.problemCategoryService = problemCategoryService;
    }

    // GET ALL CATEGORIES
    @GetMapping
    public ResponseEntity<List<ProblemCategory>> getAllCategories() {

        return ResponseEntity.ok(
                problemCategoryService.getAllCategories()
        );
    }

    // GET CATEGORY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProblemCategory> getCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                problemCategoryService.getCategoryById(id)
        );
    }

    // CREATE CATEGORY
    @PostMapping
    public ResponseEntity<ProblemCategory> createCategory(
            @RequestBody ProblemCategory category) {

        ProblemCategory createdCategory =
                problemCategoryService.createCategory(category);

        return new ResponseEntity<>(
                createdCategory,
                HttpStatus.CREATED
        );
    }

    // UPDATE CATEGORY
    @PutMapping("/{id}")
    public ResponseEntity<ProblemCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody ProblemCategory category) {

        return ResponseEntity.ok(
                problemCategoryService.updateCategory(id, category)
        );
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id) {

        problemCategoryService.deleteCategory(id);

        return ResponseEntity.ok(
                "Problem category deleted successfully"
        );
    }
}