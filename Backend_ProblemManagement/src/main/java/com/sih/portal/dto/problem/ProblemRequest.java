package com.sih.portal.dto.problem;

public class ProblemRequest {

    private Long submittedBy;

    private Long categoryId;

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

    private String requiredSkills;

    private String expectedImpact;

    // Getters and Setters

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
}