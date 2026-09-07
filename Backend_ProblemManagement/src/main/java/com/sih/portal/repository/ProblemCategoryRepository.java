package com.sih.portal.repository;

import com.sih.portal.entity.ProblemCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProblemCategoryRepository extends JpaRepository<ProblemCategory, Long> {

    Optional<ProblemCategory> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);
}