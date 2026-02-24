package com.chitfund.backend.repository;

import com.chitfund.backend.domain.ChitGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChitGroupMemberRepository extends JpaRepository<ChitGroupMember, Long> {
    List<ChitGroupMember> findByChitGroupId(Long chitGroupId);

    // Need findByCustomerId to get a customer's groups
    List<ChitGroupMember> findByCustomerId(Long customerId);

    boolean existsByChitGroupIdAndCustomerId(Long chitGroupId, Long customerId);
}
