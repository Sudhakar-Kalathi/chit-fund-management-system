package com.chitfund.backend.repository;

import com.chitfund.backend.domain.ChitGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChitGroupRepository extends JpaRepository<ChitGroup, Long> {

    boolean existsByGroupName(String groupName);

    Page<ChitGroup> findByGroupNameContainingIgnoreCase(String groupName, Pageable pageable);
}
