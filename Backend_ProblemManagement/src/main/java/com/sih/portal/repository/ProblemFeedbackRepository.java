package com.sih.portal.repository;

import com.sih.portal.entity.ProblemFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemFeedbackRepository
        extends JpaRepository<ProblemFeedback, Long> {
}