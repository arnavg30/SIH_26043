package com.sih.portal.controller;

import com.sih.portal.entity.ProjectPartnership;
import com.sih.portal.service.ProjectPartnershipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partnerships")
public class ProjectPartnershipController {

    private final ProjectPartnershipService service;

    public ProjectPartnershipController(ProjectPartnershipService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectPartnership> getAllPartnerships() {
        return service.getAllPartnerships();
    }

    @GetMapping("/{id}")
    public ProjectPartnership getPartnershipById(@PathVariable Long id) {
        return service.getPartnershipById(id);
    }

    @PostMapping
    public ProjectPartnership createPartnership(
            @RequestBody ProjectPartnership partnership) {
        return service.createPartnership(partnership);
    }

    @PutMapping("/{id}")
    public ProjectPartnership updatePartnership(
            @PathVariable Long id,
            @RequestBody ProjectPartnership partnership) {
        return service.updatePartnership(id, partnership);
    }

    @DeleteMapping("/{id}")
    public void deletePartnership(@PathVariable Long id) {
        service.deletePartnership(id);
    }
}