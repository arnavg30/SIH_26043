package com.sih.portal.dto.problem;

public class ProblemResponse {

    private Long problemId;

    private String problemCode;

    private Long submittedBy;

    private Long categoryId;

    private String categoryName;

    private String title;

    private String description;

    private String originalText;

    private Double latitude;

    private Double longitude;

    private String district;

    private String block;

    private String panchayatWard;

    private String landmark;

    private String siteAddress;

    private String reportedFor;

    private String beneficiaryName;

    private String beneficiaryPhone;

    private Boolean isAnonymous;

    private Integer priorityScore;

    private String severity;

    private String aiCategoryDetected;

    private String aiConfidence;

    private Boolean isDuplicate;

    private Long duplicateOfId;

    private String status;

    private String requiredSkills;

    private String expectedImpact;

    private String createdAt;

    private String updatedAt;

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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
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

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
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

    public void setIsDuplicate(Boolean isDuplicate) {
        this.isDuplicate = isDuplicate;
    }

    public Long getDuplicateOfId() {
        return duplicateOfId;
    }

    public void setDuplicateOfId(Long duplicateOfId) {
        this.duplicateOfId = duplicateOfId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}