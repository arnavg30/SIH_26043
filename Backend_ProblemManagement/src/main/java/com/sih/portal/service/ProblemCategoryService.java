package com.sih.portal.service;

import com.sih.portal.entity.ProblemCategory;
import com.sih.portal.repository.ProblemCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemCategoryService {

    private final ProblemCategoryRepository problemCategoryRepository;

    public ProblemCategoryService(
            ProblemCategoryRepository problemCategoryRepository) {

        this.problemCategoryRepository = problemCategoryRepository;
    }

    // GET ALL CATEGORIES

    public List<ProblemCategory> getAllCategories() {

        return problemCategoryRepository.findAll();
    }


    // GET CATEGORY BY ID

    public ProblemCategory getCategoryById(Long id) {

        return problemCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem category not found with id: " + id));
    }


    // CREATE CATEGORY

    public ProblemCategory createCategory(ProblemCategory category) {

        if (problemCategoryRepository
                .existsByCategoryName(category.getCategoryName())) {

            throw new RuntimeException(
                    "Category already exists: "
                            + category.getCategoryName());
        }

        return problemCategoryRepository.save(category);
    }


    // UPDATE CATEGORY

    public ProblemCategory updateCategory(
            Long id,
            ProblemCategory updatedCategory) {

        ProblemCategory existingCategory =
                problemCategoryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Problem category not found with id: "
                                                + id));

        existingCategory.setCategoryName(
                updatedCategory.getCategoryName());

        existingCategory.setIconKey(
                updatedCategory.getIconKey());

        existingCategory.setDescription(
                updatedCategory.getDescription());

        return problemCategoryRepository.save(existingCategory);
    }


    // DELETE CATEGORY

    public void deleteCategory(Long id) {

        ProblemCategory category =
                problemCategoryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Problem category not found with id: "
                                                + id));

        problemCategoryRepository.delete(category);
    }
}