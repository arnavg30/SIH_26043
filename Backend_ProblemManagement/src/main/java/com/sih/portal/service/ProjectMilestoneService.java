package com.sih.portal.service;

import com.sih.portal.entity.ProjectMilestone;
import com.sih.portal.repository.ProjectMilestoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectMilestoneService {

    private final ProjectMilestoneRepository repository;

    public ProjectMilestoneService(ProjectMilestoneRepository repository) {
        this.repository = repository;
    }

    public List<ProjectMilestone> getAllMilestones() {
        return repository.findAll();
    }

    public ProjectMilestone getMilestoneById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
    }

    public ProjectMilestone createMilestone(ProjectMilestone milestone) {
        return repository.save(milestone);
    }

    public ProjectMilestone updateMilestone(
            Long id,
            ProjectMilestone updatedMilestone) {

        ProjectMilestone existing = getMilestoneById(id);

        existing.setInitiative(updatedMilestone.getInitiative());
        existing.setPhaseOrder(updatedMilestone.getPhaseOrder());
        existing.setPhaseTitle(updatedMilestone.getPhaseTitle());
        existing.setDescription(updatedMilestone.getDescription());
        existing.setDeliverables(updatedMilestone.getDeliverables());
        existing.setTargetDate(updatedMilestone.getTargetDate());
        existing.setCompletedDate(updatedMilestone.getCompletedDate());
        existing.setProgressPercentage(updatedMilestone.getProgressPercentage());
        existing.setStatus(updatedMilestone.getStatus());

        return repository.save(existing);
    }

    public void deleteMilestone(Long id) {
        repository.deleteById(id);
    }
}