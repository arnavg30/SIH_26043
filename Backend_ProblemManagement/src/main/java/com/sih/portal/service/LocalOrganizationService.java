package com.sih.portal.service;

import com.sih.portal.entity.LocalOrganization;
import com.sih.portal.repository.LocalOrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocalOrganizationService {

    private final LocalOrganizationRepository localOrganizationRepository;

    public LocalOrganizationService(LocalOrganizationRepository localOrganizationRepository) {
        this.localOrganizationRepository = localOrganizationRepository;
    }

    public LocalOrganization createLocalOrganization(LocalOrganization localOrganization) {
        return localOrganizationRepository.save(localOrganization);
    }

    public Optional<LocalOrganization> getLocalOrganizationById(Long localOrgId) {
        return localOrganizationRepository.findById(localOrgId);
    }
}