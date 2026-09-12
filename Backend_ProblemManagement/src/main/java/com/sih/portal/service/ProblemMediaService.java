package com.sih.portal.service;

import com.sih.portal.entity.ProblemMedia;
import com.sih.portal.repository.ProblemMediaRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProblemMediaService {

    private final ProblemMediaRepository problemMediaRepository;

    public ProblemMediaService(ProblemMediaRepository problemMediaRepository) {
        this.problemMediaRepository = problemMediaRepository;
    }

    public ProblemMedia createProblemMedia(ProblemMedia problemMedia) {
        return problemMediaRepository.save(problemMedia);
    }

    public Optional<ProblemMedia> getProblemMediaById(Long mediaId) {
        return problemMediaRepository.findById(mediaId);
    }
}