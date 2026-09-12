package com.sih.portal.repository;

import com.sih.portal.entity.LocalOrganization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalOrganizationRepository extends JpaRepository<LocalOrganization, Long> {
}