package com.sih.portal.controller;

import com.sih.portal.entity.ProblemFeedback;
import com.sih.portal.service.ProblemFeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class ProblemFeedbackController {

    private final ProblemFeedbackService service;

    public ProblemFeedbackController(ProblemFeedbackService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProblemFeedback> getAllFeedback() {
        return service.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ProblemFeedback getFeedbackById(@PathVariable Long id) {
        return service.getFeedbackById(id);
    }

    @PostMapping
    public ProblemFeedback createFeedback(@RequestBody ProblemFeedback feedback) {
        return service.createFeedback(feedback);
    }

    @PutMapping("/{id}")
    public ProblemFeedback updateFeedback(
            @PathVariable Long id,
            @RequestBody ProblemFeedback feedback) {
        return service.updateFeedback(id, feedback);
    }

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        service.deleteFeedback(id);
    }
}