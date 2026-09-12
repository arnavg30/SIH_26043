package com.sih.portal.controller;

import com.sih.portal.entity.ProblemInitiative;
import com.sih.portal.service.ProblemInitiativeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/initiatives")
public class ProblemInitiativeController {

    private final ProblemInitiativeService service;

    public ProblemInitiativeController(ProblemInitiativeService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProblemInitiative> getAllInitiatives() {
        return service.getAllInitiatives();
    }

    @GetMapping("/{id}")
    public ProblemInitiative getInitiativeById(@PathVariable Long id) {
        return service.getInitiativeById(id);
    }

    @PostMapping
    public ProblemInitiative createInitiative(@RequestBody ProblemInitiative initiative) {
        return service.createInitiative(initiative);
    }

    @PutMapping("/{id}")
    public ProblemInitiative updateInitiative(
            @PathVariable Long id,
            @RequestBody ProblemInitiative initiative) {
        return service.updateInitiative(id, initiative);
    }

    @DeleteMapping("/{id}")
    public void deleteInitiative(@PathVariable Long id) {
        service.deleteInitiative(id);
    }
}