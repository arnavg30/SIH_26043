package com.sih.portal.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem_initiatives")
public class ProblemInitiative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "initiative_id")
    private Long initiativeId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "solver_user_id", nullable = false)
    private Long solverUserId;

    @Column(name = "initiative_title", nullable = false, length = 250)
    private String initiativeTitle;

    @Column(name = "problem_understanding")
    private String problemUnderstanding;

    @Column(name = "proposed_solution", nullable = false)
    private String proposedSolution;

    @Column(name = "technology_approach")
    private String technologyApproach;

    @Column(name = "expected_impact")
    private String expectedImpact;

    @Column(name = "estimated_budget", precision = 12, scale = 2)
    private BigDecimal estimatedBudget;

    @Column(name = "timeline_months")
    private Integer timelineMonths;

    @Column(name = "timeline_display", length = 100)
    private String timelineDisplay;

    @Column(name = "faculty_guide_name", length = 150)
    private String facultyGuideName;

    @Column(name = "faculty_guide_email", length = 255)
    private String facultyGuideEmail;

    @Column(name = "team_leader_name", length = 150)
    private String teamLeaderName;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PROPOSED";

    @Column(name = "started_at")
    private LocalDateTime startedAt;



    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public ProblemInitiative() {
    }

    public Long getInitiativeId() {
        return initiativeId;
    }

    public void setInitiativeId(Long initiativeId) {
        this.initiativeId = initiativeId;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Long getSolverUserId() {
        return solverUserId;
    }

    public void setSolverUserId(Long solverUserId) {
        this.solverUserId = solverUserId;
    }

    public String getInitiativeTitle() {
        return initiativeTitle;
    }

    public void setInitiativeTitle(String initiativeTitle) {
        this.initiativeTitle = initiativeTitle;
    }

    public String getProblemUnderstanding() {
        return problemUnderstanding;
    }

    public void setProblemUnderstanding(String problemUnderstanding) {
        this.problemUnderstanding = problemUnderstanding;
    }

    public String getProposedSolution() {
        return proposedSolution;
    }

    public void setProposedSolution(String proposedSolution) {
        this.proposedSolution = proposedSolution;
    }

    public String getTechnologyApproach() {
        return technologyApproach;
    }

    public void setTechnologyApproach(String technologyApproach) {
        this.technologyApproach = technologyApproach;
    }

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public BigDecimal getEstimatedBudget() {
        return estimatedBudget;
    }

    public void setEstimatedBudget(BigDecimal estimatedBudget) {
        this.estimatedBudget = estimatedBudget;
    }

    public Integer getTimelineMonths() {
        return timelineMonths;
    }

    public void setTimelineMonths(Integer timelineMonths) {
        this.timelineMonths = timelineMonths;
    }

    public String getTimelineDisplay() {
        return timelineDisplay;
    }

    public void setTimelineDisplay(String timelineDisplay) {
        this.timelineDisplay = timelineDisplay;
    }

    public String getFacultyGuideName() {
        return facultyGuideName;
    }

    public void setFacultyGuideName(String facultyGuideName) {
        this.facultyGuideName = facultyGuideName;
    }

    public String getFacultyGuideEmail() {
        return facultyGuideEmail;
    }

    public void setFacultyGuideEmail(String facultyGuideEmail) {
        this.facultyGuideEmail = facultyGuideEmail;
    }

    public String getTeamLeaderName() {
        return teamLeaderName;
    }

    public void setTeamLeaderName(String teamLeaderName) {
        this.teamLeaderName = teamLeaderName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
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
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}