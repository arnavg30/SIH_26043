package com.sih.portal.controller;

import com.sih.portal.entity.Organization;
import com.sih.portal.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    public ResponseEntity<Organization> createOrganization(
            @RequestBody Organization organization) {

        Organization createdOrganization =
                organizationService.createOrganization(organization);

        return ResponseEntity.ok(createdOrganization);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(
            @PathVariable Long id) {

        return organizationService.getOrganizationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}