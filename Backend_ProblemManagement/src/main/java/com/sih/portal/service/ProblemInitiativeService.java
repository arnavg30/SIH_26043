package com.sih.portal.service;

import com.sih.portal.entity.ProblemInitiative;
import com.sih.portal.repository.ProblemInitiativeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemInitiativeService {

    private final ProblemInitiativeRepository repository;

    public ProblemInitiativeService(ProblemInitiativeRepository repository) {
        this.repository = repository;
    }

    public List<ProblemInitiative> getAllInitiatives() {
        return repository.findAll();
    }

    public ProblemInitiative getInitiativeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Initiative not found"));
    }

    public ProblemInitiative createInitiative(ProblemInitiative initiative) {
        return repository.save(initiative);
    }

    public ProblemInitiative updateInitiative(Long id, ProblemInitiative updatedInitiative) {
        ProblemInitiative existing = getInitiativeById(id);

        existing.setProblemId(updatedInitiative.getProblemId());
        existing.setSolverUserId(updatedInitiative.getSolverUserId());
        existing.setInitiativeTitle(updatedInitiative.getInitiativeTitle());
        existing.setProblemUnderstanding(updatedInitiative.getProblemUnderstanding());
        existing.setProposedSolution(updatedInitiative.getProposedSolution());
        existing.setTechnologyApproach(updatedInitiative.getTechnologyApproach());
        existing.setExpectedImpact(updatedInitiative.getExpectedImpact());
        existing.setEstimatedBudget(updatedInitiative.getEstimatedBudget());
        existing.setTimelineMonths(updatedInitiative.getTimelineMonths());
        existing.setTimelineDisplay(updatedInitiative.getTimelineDisplay());
        existing.setFacultyGuideName(updatedInitiative.getFacultyGuideName());
        existing.setFacultyGuideEmail(updatedInitiative.getFacultyGuideEmail());
        existing.setTeamLeaderName(updatedInitiative.getTeamLeaderName());
        existing.setStatus(updatedInitiative.getStatus());

        return repository.save(existing);
    }

    public void deleteInitiative(Long id) {
        repository.deleteById(id);
    }
}