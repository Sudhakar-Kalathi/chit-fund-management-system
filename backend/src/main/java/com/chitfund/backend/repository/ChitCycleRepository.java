package com.chitfund.backend.repository;

import com.chitfund.backend.domain.ChitCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChitCycleRepository extends JpaRepository<ChitCycle, Long> {
    List<ChitCycle> findByChitGroupIdOrderByMonthNumberAsc(Long chitGroupId);
}
