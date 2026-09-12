package com.sih.portal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "organization_id")
    private Long organizationId;

    // Proper relationship with users table
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(name = "organization_name", nullable = false, length = 200)
    private String organizationName;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "spoc_name", nullable = false, length = 150)
    private String spocName;

    @Column(name = "spoc_contact", nullable = false, length = 30)
    private String spocContact;

    @Column(name = "domain", nullable = false, length = 100)
    private String domain;

    @Column(name = "domain_expertise", columnDefinition = "TEXT")
    private String domainExpertise;

    @Column(
            name = "registered_address",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String registeredAddress;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    // Required by JPA
    public Organization() {
    }


    // Automatically set timestamps when a new organization is created
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }


    // Automatically update updatedAt whenever record changes
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


    // ---------------- GETTERS AND SETTERS ----------------

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }


    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }


    public String getSpocName() {
        return spocName;
    }

    public void setSpocName(String spocName) {
        this.spocName = spocName;
    }


    public String getSpocContact() {
        return spocContact;
    }

    public void setSpocContact(String spocContact) {
        this.spocContact = spocContact;
    }


    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }


    public String getDomainExpertise() {
        return domainExpertise;
    }

    public void setDomainExpertise(String domainExpertise) {
        this.domainExpertise = domainExpertise;
    }


    public String getRegisteredAddress() {
        return registeredAddress;
    }

    public void setRegisteredAddress(String registeredAddress) {
        this.registeredAddress = registeredAddress;
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