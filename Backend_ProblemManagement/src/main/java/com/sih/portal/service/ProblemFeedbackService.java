package com.sih.portal.service;

import com.sih.portal.entity.ProblemFeedback;
import com.sih.portal.repository.ProblemFeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemFeedbackService {

    private final ProblemFeedbackRepository repository;

    public ProblemFeedbackService(ProblemFeedbackRepository repository) {
        this.repository = repository;
    }

    public List<ProblemFeedback> getAllFeedback() {
        return repository.findAll();
    }

    public ProblemFeedback getFeedbackById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    public ProblemFeedback createFeedback(ProblemFeedback feedback) {
        return repository.save(feedback);
    }

    public ProblemFeedback updateFeedback(Long id, ProblemFeedback updatedFeedback) {
        ProblemFeedback existing = getFeedbackById(id);

        existing.setProblem(updatedFeedback.getProblem());
        existing.setUser(updatedFeedback.getUser());
        existing.setRating(updatedFeedback.getRating());
        existing.setComments(updatedFeedback.getComments());

        return repository.save(existing);
    }

    public void deleteFeedback(Long id) {
        repository.deleteById(id);
    }
}