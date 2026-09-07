package com.sih.portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_categories")
public class ProblemCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    @Column(name = "icon_key")
    private String iconKey;

    @Column(name = "description")
    private String description;

    public ProblemCategory() {
    }

    public ProblemCategory(String categoryName, String iconKey, String description) {
        this.categoryName = categoryName;
        this.iconKey = iconKey;
        this.description = description;
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

    public String getIconKey() {
        return iconKey;
    }

    public void setIconKey(String iconKey) {
        this.iconKey = iconKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}