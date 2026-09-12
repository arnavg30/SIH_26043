package com.sih.portal.repository;

import com.sih.portal.entity.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMilestoneRepository
        extends JpaRepository<ProjectMilestone, Long> {
}