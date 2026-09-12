package com.sih.portal.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_partnerships")
public class ProjectPartnership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "partnership_id")
    private Long partnershipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiative_id", nullable = false)
    private ProblemInitiative initiative;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "industry_user_id", nullable = false)
    private User industryUser;

    @Column(name = "support_types", nullable = false, columnDefinition = "TEXT")
    private String supportTypes;

    @Column(name = "budget_offered", precision = 12, scale = 2)
    private BigDecimal budgetOffered;

    @Column(name = "mentor_hours_per_week", length = 50)
    private String mentorHoursPerWeek;

    @Column(name = "contact_person", nullable = false, length = 150)
    private String contactPerson;

    @Column(name = "contact_email", nullable = false, length = 255)
    private String contactEmail;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "OFFERED";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ProjectPartnership() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = "OFFERED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getPartnershipId() {
        return partnershipId;
    }

    public void setPartnershipId(Long partnershipId) {
        this.partnershipId = partnershipId;
    }

    public ProblemInitiative getInitiative() {
        return initiative;
    }

    public void setInitiative(ProblemInitiative initiative) {
        this.initiative = initiative;
    }

    public User getIndustryUser() {
        return industryUser;
    }

    public void setIndustryUser(User industryUser) {
        this.industryUser = industryUser;
    }

    public String getSupportTypes() {
        return supportTypes;
    }

    public void setSupportTypes(String supportTypes) {
        this.supportTypes = supportTypes;
    }

    public BigDecimal getBudgetOffered() {
        return budgetOffered;
    }

    public void setBudgetOffered(BigDecimal budgetOffered) {
        this.budgetOffered = budgetOffered;
    }

    public String getMentorHoursPerWeek() {
        return mentorHoursPerWeek;
    }

    public void setMentorHoursPerWeek(String mentorHoursPerWeek) {
        this.mentorHoursPerWeek = mentorHoursPerWeek;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}