package com.sih.portal.service;

import com.sih.portal.entity.Citizen;
import com.sih.portal.repository.CitizenRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;

    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    public Citizen createCitizen(Citizen citizen) {
        return citizenRepository.save(citizen);
    }

    public Optional<Citizen> getCitizenById(Long citizenId) {
        return citizenRepository.findById(citizenId);
    }
}