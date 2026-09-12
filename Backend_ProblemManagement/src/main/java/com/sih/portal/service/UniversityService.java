package com.sih.portal.service;

import com.sih.portal.entity.University;
import com.sih.portal.repository.UniversityRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public University createUniversity(University university) {
        return universityRepository.save(university);
    }

    public Optional<University> getUniversityById(Long universityId) {
        return universityRepository.findById(universityId);
    }
}