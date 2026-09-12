package com.sih.portal.controller;

import com.sih.portal.entity.Panchayat;
import com.sih.portal.service.PanchayatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/panchayats")
public class PanchayatController {

    private final PanchayatService panchayatService;

    public PanchayatController(PanchayatService panchayatService) {
        this.panchayatService = panchayatService;
    }

    @PostMapping
    public ResponseEntity<Panchayat> createPanchayat(@RequestBody Panchayat panchayat) {
        Panchayat createdPanchayat = panchayatService.createPanchayat(panchayat);
        return ResponseEntity.ok(createdPanchayat);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Panchayat> getPanchayatById(@PathVariable Long id) {
        return panchayatService.getPanchayatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}