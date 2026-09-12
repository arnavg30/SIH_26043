package com.sih.portal.controller;

import com.sih.portal.entity.LocalOrganization;
import com.sih.portal.service.LocalOrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/local-organizations")
public class LocalOrganizationController {

    private final LocalOrganizationService localOrganizationService;

    public LocalOrganizationController(LocalOrganizationService localOrganizationService) {
        this.localOrganizationService = localOrganizationService;
    }

    @PostMapping
    public ResponseEntity<LocalOrganization> createLocalOrganization(
            @RequestBody LocalOrganization localOrganization) {

        LocalOrganization createdLocalOrganization =
                localOrganizationService.createLocalOrganization(localOrganization);

        return ResponseEntity.ok(createdLocalOrganization);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalOrganization> getLocalOrganizationById(
            @PathVariable Long id) {

        return localOrganizationService.getLocalOrganizationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}