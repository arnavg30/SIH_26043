package com.sih.portal.service;

import com.sih.portal.dto.problem.ProblemRequest;
import com.sih.portal.dto.problem.ProblemResponse;
import com.sih.portal.dto.problem.ProblemStatusRequest;
import com.sih.portal.entity.Problem;
import com.sih.portal.entity.ProblemCategory;
import com.sih.portal.repository.ProblemCategoryRepository;
import com.sih.portal.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemCategoryRepository problemCategoryRepository;

    public ProblemService(
            ProblemRepository problemRepository,
            ProblemCategoryRepository problemCategoryRepository) {

        this.problemRepository = problemRepository;
        this.problemCategoryRepository = problemCategoryRepository;
    }

    // CREATE PROBLEM
    public ProblemResponse createProblem(ProblemRequest request) {

        ProblemCategory category = problemCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Problem category not found"));

        Problem problem = new Problem();

        problem.setSubmittedBy(request.getSubmittedBy());
        problem.setCategory(category);
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setOriginalText(request.getOriginalText());

        // Convert Double to BigDecimal
        if (request.getLatitude() != null) {
            problem.setLatitude(
                    BigDecimal.valueOf(request.getLatitude())
            );
        }

        if (request.getLongitude() != null) {
            problem.setLongitude(
                    BigDecimal.valueOf(request.getLongitude())
            );
        }

        problem.setDistrict(request.getDistrict());
        problem.setBlock(request.getBlock());
        problem.setPanchayatWard(request.getPanchayatWard());
        problem.setLandmark(request.getLandmark());
        problem.setSiteAddress(request.getSiteAddress());

        problem.setReportedFor(request.getReportedFor());
        problem.setBeneficiaryName(request.getBeneficiaryName());
        problem.setBeneficiaryPhone(request.getBeneficiaryPhone());
        problem.setIsAnonymous(request.getIsAnonymous());

        problem.setRequiredSkills(request.getRequiredSkills());
        problem.setExpectedImpact(request.getExpectedImpact());

        problem.setProblemCode(generateProblemCode());

        Problem savedProblem = problemRepository.save(problem);

        return convertToResponse(savedProblem);
    }


    // GET ALL PROBLEMS
    public List<ProblemResponse> getAllProblems() {

        return problemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // GET PROBLEM BY ID
    public ProblemResponse getProblemById(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem not found with id: " + id));

        return convertToResponse(problem);
    }


    // UPDATE PROBLEM
    public ProblemResponse updateProblem(
            Long id,
            ProblemRequest request) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem not found with id: " + id));

        ProblemCategory category = problemCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem category not found"));

        problem.setCategory(category);
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setOriginalText(request.getOriginalText());

        // Convert Double to BigDecimal
        if (request.getLatitude() != null) {
            problem.setLatitude(
                    BigDecimal.valueOf(request.getLatitude())
            );
        } else {
            problem.setLatitude(null);
        }

        if (request.getLongitude() != null) {
            problem.setLongitude(
                    BigDecimal.valueOf(request.getLongitude())
            );
        } else {
            problem.setLongitude(null);
        }

        problem.setDistrict(request.getDistrict());
        problem.setBlock(request.getBlock());
        problem.setPanchayatWard(request.getPanchayatWard());
        problem.setLandmark(request.getLandmark());
        problem.setSiteAddress(request.getSiteAddress());

        problem.setReportedFor(request.getReportedFor());
        problem.setBeneficiaryName(request.getBeneficiaryName());
        problem.setBeneficiaryPhone(request.getBeneficiaryPhone());
        problem.setIsAnonymous(request.getIsAnonymous());

        problem.setRequiredSkills(request.getRequiredSkills());
        problem.setExpectedImpact(request.getExpectedImpact());

        Problem updatedProblem = problemRepository.save(problem);

        return convertToResponse(updatedProblem);
    }


    // DELETE PROBLEM
    public void deleteProblem(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem not found with id: " + id));

        problemRepository.delete(problem);
    }


    // UPDATE STATUS
    public ProblemResponse updateStatus(
            Long id,
            ProblemStatusRequest request) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Problem not found with id: " + id));

        String status = request.getStatus();

        if (!isValidStatus(status)) {
            throw new RuntimeException(
                    "Invalid problem status: " + status);
        }

        problem.setStatus(status);

        Problem updatedProblem = problemRepository.save(problem);

        return convertToResponse(updatedProblem);
    }


    // GET PROBLEMS BY STATUS
    public List<ProblemResponse> getProblemsByStatus(String status) {

        return problemRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // GET PROBLEMS BY CATEGORY
    public List<ProblemResponse> getProblemsByCategory(Long categoryId) {

        return problemRepository
                .findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // GET DUPLICATE REPORTS
    public List<ProblemResponse> getDuplicateReports(Long problemId) {

        return problemRepository
                .findByDuplicateOfId(problemId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // COUNT DUPLICATE REPORTS
    public long getDuplicateReportCount(Long problemId) {

        return problemRepository.countByDuplicateOfId(problemId);
    }


    // CONVERT ENTITY TO RESPONSE
    private ProblemResponse convertToResponse(Problem problem) {

        ProblemResponse response = new ProblemResponse();

        response.setProblemId(problem.getProblemId());
        response.setProblemCode(problem.getProblemCode());

        response.setSubmittedBy(problem.getSubmittedBy());

        if (problem.getCategory() != null) {

            response.setCategoryId(
                    problem.getCategory().getCategoryId());

            response.setCategoryName(
                    problem.getCategory().getCategoryName());
        }

        response.setTitle(problem.getTitle());
        response.setDescription(problem.getDescription());
        response.setOriginalText(problem.getOriginalText());

        // Convert BigDecimal to Double
        if (problem.getLatitude() != null) {
            response.setLatitude(
                    problem.getLatitude().doubleValue()
            );
        }

        if (problem.getLongitude() != null) {
            response.setLongitude(
                    problem.getLongitude().doubleValue()
            );
        }

        response.setDistrict(problem.getDistrict());
        response.setBlock(problem.getBlock());
        response.setPanchayatWard(problem.getPanchayatWard());
        response.setLandmark(problem.getLandmark());
        response.setSiteAddress(problem.getSiteAddress());

        response.setReportedFor(problem.getReportedFor());
        response.setBeneficiaryName(problem.getBeneficiaryName());
        response.setBeneficiaryPhone(problem.getBeneficiaryPhone());
        response.setIsAnonymous(problem.getIsAnonymous());

        response.setPriorityScore(problem.getPriorityScore());
        response.setSeverity(problem.getSeverity());

        response.setAiCategoryDetected(
                problem.getAiCategoryDetected());

        response.setAiConfidence(
                problem.getAiConfidence());

        response.setIsDuplicate(
                problem.getIsDuplicate());

        response.setDuplicateOfId(
                problem.getDuplicateOfId());

        response.setStatus(problem.getStatus());

        response.setRequiredSkills(
                problem.getRequiredSkills());

        response.setExpectedImpact(
                problem.getExpectedImpact());

        if (problem.getCreatedAt() != null) {
            response.setCreatedAt(
                    problem.getCreatedAt().toString());
        }

        if (problem.getUpdatedAt() != null) {
            response.setUpdatedAt(
                    problem.getUpdatedAt().toString());
        }

        return response;
    }


    // GENERATE PROBLEM CODE
    private String generateProblemCode() {

        return "SIH-" + System.currentTimeMillis();
    }


    // VALIDATE STATUS
    private boolean isValidStatus(String status) {

        if (status == null) {
            return false;
        }

        return status.equals("SUBMITTED")
                || status.equals("UNDER_REVIEW")
                || status.equals("ASSIGNED")
                || status.equals("IN_PROGRESS")
                || status.equals("SOLVED");
    }
}