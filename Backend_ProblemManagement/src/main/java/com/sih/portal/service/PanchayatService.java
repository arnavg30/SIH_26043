package com.sih.portal.service;

import com.sih.portal.entity.Panchayat;
import com.sih.portal.repository.PanchayatRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PanchayatService {

    private final PanchayatRepository panchayatRepository;

    public PanchayatService(PanchayatRepository panchayatRepository) {
        this.panchayatRepository = panchayatRepository;
    }

    public Panchayat createPanchayat(Panchayat panchayat) {
        return panchayatRepository.save(panchayat);
    }

    public Optional<Panchayat> getPanchayatById(Long panchayatId) {
        return panchayatRepository.findById(panchayatId);
    }
}