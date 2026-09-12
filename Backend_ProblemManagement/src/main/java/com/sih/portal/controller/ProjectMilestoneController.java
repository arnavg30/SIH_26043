package com.sih.portal.controller;

import com.sih.portal.entity.ProjectMilestone;
import com.sih.portal.service.ProjectMilestoneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/milestones")
public class ProjectMilestoneController {

    private final ProjectMilestoneService service;

    public ProjectMilestoneController(ProjectMilestoneService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectMilestone> getAllMilestones() {
        return service.getAllMilestones();
    }

    @GetMapping("/{id}")
    public ProjectMilestone getMilestoneById(@PathVariable Long id) {
        return service.getMilestoneById(id);
    }

    @PostMapping
    public ProjectMilestone createMilestone(
            @RequestBody ProjectMilestone milestone) {
        return service.createMilestone(milestone);
    }

    @PutMapping("/{id}")
    public ProjectMilestone updateMilestone(
            @PathVariable Long id,
            @RequestBody ProjectMilestone milestone) {
        return service.updateMilestone(id, milestone);
    }

    @DeleteMapping("/{id}")
    public void deleteMilestone(@PathVariable Long id) {
        service.deleteMilestone(id);
    }
}