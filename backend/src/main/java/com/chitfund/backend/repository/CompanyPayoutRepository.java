package com.chitfund.backend.repository;

import com.chitfund.backend.domain.CompanyPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyPayoutRepository extends JpaRepository<CompanyPayout, Long> {
    List<CompanyPayout> findByChitGroupIdAndActiveTrueOrderByChitCycleMonthNumberAsc(Long chitGroupId);

    Optional<CompanyPayout> findByChitCycleIdAndActiveTrue(Long chitCycleId);
}
