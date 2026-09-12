package com.sih.portal.service;

import com.sih.portal.entity.ProjectPartnership;
import com.sih.portal.repository.ProjectPartnershipRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectPartnershipService {

    private final ProjectPartnershipRepository repository;

    public ProjectPartnershipService(ProjectPartnershipRepository repository) {
        this.repository = repository;
    }

    public List<ProjectPartnership> getAllPartnerships() {
        return repository.findAll();
    }

    public ProjectPartnership getPartnershipById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partnership not found"));
    }

    public ProjectPartnership createPartnership(ProjectPartnership partnership) {
        return repository.save(partnership);
    }

    public ProjectPartnership updatePartnership(
            Long id,
            ProjectPartnership updatedPartnership) {

        ProjectPartnership existing = getPartnershipById(id);

        existing.setInitiative(updatedPartnership.getInitiative());
        existing.setIndustryUser(updatedPartnership.getIndustryUser());
        existing.setSupportTypes(updatedPartnership.getSupportTypes());
        existing.setBudgetOffered(updatedPartnership.getBudgetOffered());
        existing.setMentorHoursPerWeek(updatedPartnership.getMentorHoursPerWeek());
        existing.setContactPerson(updatedPartnership.getContactPerson());
        existing.setContactEmail(updatedPartnership.getContactEmail());
        existing.setNotes(updatedPartnership.getNotes());
        existing.setStatus(updatedPartnership.getStatus());

        return repository.save(existing);
    }

    public void deletePartnership(Long id) {
        repository.deleteById(id);
    }
}