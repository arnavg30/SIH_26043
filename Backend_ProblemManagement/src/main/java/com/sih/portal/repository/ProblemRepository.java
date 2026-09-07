package com.sih.portal.repository;

import com.sih.portal.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByStatus(String status);

    List<Problem> findByCategory_CategoryId(Long categoryId);

    List<Problem> findByDistrictAndBlock(String district, String block);

    List<Problem> findByDuplicateOfId(Long duplicateOfId);

    long countByDuplicateOfId(Long duplicateOfId);

    boolean existsByProblemCode(String problemCode);
}