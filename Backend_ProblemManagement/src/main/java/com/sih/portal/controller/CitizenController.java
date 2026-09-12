package com.sih.portal.controller;

import com.sih.portal.entity.Citizen;
import com.sih.portal.service.CitizenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizens")
public class CitizenController {

    private final CitizenService citizenService;

    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @PostMapping
    public ResponseEntity<Citizen> createCitizen(@RequestBody Citizen citizen) {
        Citizen createdCitizen = citizenService.createCitizen(citizen);
        return ResponseEntity.ok(createdCitizen);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Citizen> getCitizenById(@PathVariable Long id) {
        return citizenService.getCitizenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}