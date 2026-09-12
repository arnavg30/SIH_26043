package com.sih.portal.controller;

import com.sih.portal.entity.Industry;
import com.sih.portal.service.IndustryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/industries")
public class IndustryController {

    private final IndustryService industryService;

    public IndustryController(IndustryService industryService) {
        this.industryService = industryService;
    }

    @PostMapping
    public ResponseEntity<Industry> createIndustry(@RequestBody Industry industry) {
        Industry createdIndustry = industryService.createIndustry(industry);
        return ResponseEntity.ok(createdIndustry);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Industry> getIndustryById(@PathVariable Long id) {
        return industryService.getIndustryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}