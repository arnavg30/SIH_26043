package com.sih.portal.service;

import com.sih.portal.entity.Industry;
import com.sih.portal.repository.IndustryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IndustryService {

    private final IndustryRepository industryRepository;

    public IndustryService(IndustryRepository industryRepository) {
        this.industryRepository = industryRepository;
    }

    public Industry createIndustry(Industry industry) {
        return industryRepository.save(industry);
    }

    public Optional<Industry> getIndustryById(Long industryId) {
        return industryRepository.findById(industryId);
    }
}