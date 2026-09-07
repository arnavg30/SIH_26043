package com.sih.portal.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long problemId;

    @Column(name = "problem_code", nullable = false, unique = true)
    private String problemCode;

    @Column(name = "submitted_by", nullable = false)
    private Long submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProblemCategory category;

    @Column(name = "title", nullable = false, length = 250)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "original_text", columnDefinition = "TEXT")
    private String originalText;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "block", nullable = false, length = 100)
    private String block;

    @Column(name = "panchayat_ward", length = 150)
    private String panchayatWard;

    @Column(name = "landmark", length = 150)
    private String landmark;

    @Column(name = "site_address", nullable = false, columnDefinition = "TEXT")
    private String siteAddress;

    @Column(name = "reported_for", length = 30)
    private String reportedFor;

    @Column(name = "beneficiary_name", length = 150)
    private String beneficiaryName;

    @Column(name = "beneficiary_phone", length = 20)
    private String beneficiaryPhone;

    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous = false;

    @Column(name = "priority_score")
    private Integer priorityScore = 50;

    @Column(name = "severity", length = 20)
    private String severity = "MEDIUM";

    @Column(name = "ai_category_detected", length = 100)
    private String aiCategoryDetected;

    @Column(name = "ai_confidence", length = 20)
    private String aiConfidence;

    @Column(name = "is_duplicate", nullable = false)
    private Boolean isDuplicate = false;

    @Column(name = "duplicate_of_id")
    private Long duplicateOfId;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "expected_impact", columnDefinition = "TEXT")
    private String expectedImpact;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SUBMITTED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    // Default constructor required by JPA
    public Problem() {
    }


    // Automatically set timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // Getters and Setters

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getProblemCode() {
        return problemCode;
    }

    public void setProblemCode(String problemCode) {
        this.problemCode = problemCode;
    }

    public Long getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(Long submittedBy) {
        this.submittedBy = submittedBy;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getPanchayatWard() {
        return panchayatWard;
    }

    public void setPanchayatWard(String panchayatWard) {
        this.panchayatWard = panchayatWard;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getSiteAddress() {
        return siteAddress;
    }

    public void setSiteAddress(String siteAddress) {
        this.siteAddress = siteAddress;
    }

    public String getReportedFor() {
        return reportedFor;
    }

    public void setReportedFor(String reportedFor) {
        this.reportedFor = reportedFor;
    }

    public String getBeneficiaryName() {
        return beneficiaryName;
    }

    public void setBeneficiaryName(String beneficiaryName) {
        this.beneficiaryName = beneficiaryName;
    }

    public String getBeneficiaryPhone() {
        return beneficiaryPhone;
    }

    public void setBeneficiaryPhone(String beneficiaryPhone) {
        this.beneficiaryPhone = beneficiaryPhone;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
    }

    public Integer getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(Integer priorityScore) {
        this.priorityScore = priorityScore;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getAiCategoryDetected() {
        return aiCategoryDetected;
    }

    public void setAiCategoryDetected(String aiCategoryDetected) {
        this.aiCategoryDetected = aiCategoryDetected;
    }

    public String getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(String aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

    public Boolean getIsDuplicate() {
        return isDuplicate;
    }

    public void setIsDuplicate(Boolean duplicate) {
        isDuplicate = duplicate;
    }

    public Long getDuplicateOfId() {
        return duplicateOfId;
    }

    public void setDuplicateOfId(Long duplicateOfId) {
        this.duplicateOfId = duplicateOfId;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}