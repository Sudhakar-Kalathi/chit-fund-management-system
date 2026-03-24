package com.chitfund.backend.service;

import com.chitfund.backend.domain.ChitCycle;
import com.chitfund.backend.domain.ChitGroup;
import com.chitfund.backend.domain.ChitGroupMember;
import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.dto.ChitCycleDTO;
import com.chitfund.backend.dto.ChitGroupDetailedDTO;
import com.chitfund.backend.dto.ChitGroupRequestDTO;
import com.chitfund.backend.dto.ChitGroupResponseDTO;
import com.chitfund.backend.exception.DuplicateResourceException;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.ChitGroupMapper;
import com.chitfund.backend.mapper.CustomerMapper;
import com.chitfund.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChitGroupService {

    private final ChitGroupRepository chitGroupRepository;
    private final ChitGroupMemberRepository chitGroupMemberRepository;
    private final ChitCycleRepository chitCycleRepository;
    private final CustomerRepository customerRepository;
    private final ChitGroupMapper chitGroupMapper;
    private final CustomerMapper customerMapper;
    private final CompanyPayoutService companyPayoutService;

    @Transactional
    public ChitGroupResponseDTO createChitGroup(ChitGroupRequestDTO dto) {
        if (chitGroupRepository.existsByGroupName(dto.getGroupName())) {
            throw new DuplicateResourceException("Chit group already exists with name: " + dto.getGroupName());
        }

        ChitGroup group = chitGroupMapper.toEntity(dto);
        // Ensure total members equals total months as per requirement
        group.setTotalMembers(dto.getTotalMonths());

        ChitGroup savedGroup = chitGroupRepository.save(group);

        // Initialize empty cycles for tracking
        initializeCycles(savedGroup);

        return chitGroupMapper.toResponse(savedGroup);
    }

    private void initializeCycles(ChitGroup group) {
        List<ChitCycle> cycles = new ArrayList<>();
        LocalDate startDate = group.getStartDate() != null ? group.getStartDate() : LocalDate.now();

        for (int i = 1; i <= group.getTotalMonths(); i++) {
            ChitCycle cycle = new ChitCycle();
            cycle.setChitGroup(group);
            cycle.setMonthNumber(i);
            cycle.setStatus("PENDING");
            // Estimate future dates (can be edited later)
            cycle.setAuctionDate(startDate.plusMonths(i - 1));
            cycles.add(cycle);
        }
        chitCycleRepository.saveAll(cycles);
    }

    @Transactional(readOnly = true)
    public Page<ChitGroupResponseDTO> getAllChitGroups(Pageable pageable) {
        return chitGroupRepository.findByActiveTrue(pageable)
                .map(chitGroupMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ChitGroupResponseDTO> searchChitGroups(String query, Pageable pageable) {
        return chitGroupRepository.findByActiveTrueAndGroupNameContainingIgnoreCase(query, pageable)
                .map(chitGroupMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ChitGroupDetailedDTO getChitGroupDetails(Long id) {
        ChitGroup group = chitGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chit Group not found with id: " + id));

        List<ChitCycle> cycles = chitCycleRepository.findByChitGroupIdOrderByMonthNumberAsc(id);
        List<ChitGroupMember> members = chitGroupMemberRepository.findByChitGroupId(id);

        ChitGroupDetailedDTO detailedDTO = new ChitGroupDetailedDTO();
        detailedDTO.setGroupDetails(chitGroupMapper.toResponse(group));
        detailedDTO.setCycles(cycles.stream().map(chitGroupMapper::toCycleDTO).collect(Collectors.toList()));
        detailedDTO.setMembers(members.stream()
                .map(member -> customerMapper.toResponse(member.getCustomer()))
                .collect(Collectors.toList()));

        return detailedDTO;
    }

    @Transactional
    public void addMemberToGroup(Long groupId, Long customerId) {
        if (chitGroupMemberRepository.existsByChitGroupIdAndCustomerId(groupId, customerId)) {
            throw new DuplicateResourceException("Customer already in this group");
        }

        ChitGroup group = chitGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Chit Group not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Check if group is full
        long currentMemberCount = chitGroupMemberRepository.findByChitGroupId(groupId).size();
        if (currentMemberCount >= group.getTotalMembers()) {
            throw new com.chitfund.backend.exception.BusinessException(
                    "Chit Group is full. Max members: " + group.getTotalMembers());
        }

        ChitGroupMember member = new ChitGroupMember();
        member.setChitGroup(group);
        member.setCustomer(customer);
        chitGroupMemberRepository.save(member);
    }

    @Transactional
    public ChitCycleDTO updateChitCycle(Long cycleId, ChitCycleDTO dto) {
        ChitCycle cycle = chitCycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (dto.getWinnerId() != null) {
            Customer winner = customerRepository.findById(dto.getWinnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Winner (Customer) not found"));
            cycle.setWinner(winner);
        }

        cycle.setAuctionDate(dto.getAuctionDate());
        cycle.setChitPayoutAmount(dto.getChitPayoutAmount());
        cycle.setAuctionAmount(dto.getAuctionAmount());
        cycle.setCommissionAmount(dto.getCommissionAmount());
        cycle.setDividendAmount(dto.getDividendAmount());
        cycle.setFinalMonthlyAmount(dto.getFinalMonthlyAmount());
        cycle.setStatus("COMPLETED");

        ChitCycle updatedCycle = chitCycleRepository.save(cycle);

        // Note: ChitGroup entity tracks status via ChitCycle records, not a
        // currentMonth counter
        companyPayoutService.generatePayoutForCycle(updatedCycle.getId());

        return chitGroupMapper.toCycleDTO(updatedCycle);
    }
}
