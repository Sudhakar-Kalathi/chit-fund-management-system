package com.chitfund.backend.controller;

import com.chitfund.backend.dto.*;
import com.chitfund.backend.service.ChitGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chit-groups")
public class ChitGroupController {

    private final ChitGroupService chitGroupService;

    // ADMIN ONLY - Create Group
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ChitGroupResponseDTO>> createChitGroup(
            @Valid @RequestBody ChitGroupRequestDTO dto) {
        ChitGroupResponseDTO created = chitGroupService.createChitGroup(dto);
        return ResponseEntity.ok(ApiResponse.success("Chit group created successfully", created));
    }

    // ADMIN + STAFF - View All with Pagination
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Page<ChitGroupResponseDTO>>> getAllChitGroups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ChitGroupResponseDTO> groups = chitGroupService.getAllChitGroups(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Chit groups fetched successfully", groups));
    }

    // ADMIN + STAFF - Search
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Page<ChitGroupResponseDTO>>> searchChitGroups(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ChitGroupResponseDTO> groups = chitGroupService.searchChitGroups(query, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", groups));
    }

    // ADMIN + STAFF - Get Full Details (Cycles + Members)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<ChitGroupDetailedDTO>> getChitGroupDetails(@PathVariable Long id) {
        ChitGroupDetailedDTO details = chitGroupService.getChitGroupDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Chit group details fetched successfully", details));
    }

    // ADMIN ONLY - Add Member
    @PostMapping("/{groupId}/members/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> addMember(@PathVariable Long groupId, @PathVariable Long customerId) {
        chitGroupService.addMemberToGroup(groupId, customerId);
        return ResponseEntity.ok(ApiResponse.success("Member added successfully", null));
    }

    // ADMIN ONLY - Update Cycle (Monthly Overview)
    @PutMapping("/cycles/{cycleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ChitCycleDTO>> updateCycle(@PathVariable Long cycleId,
            @RequestBody ChitCycleDTO dto) {
        ChitCycleDTO updated = chitGroupService.updateChitCycle(cycleId, dto);
        return ResponseEntity.ok(ApiResponse.success("Chit cycle updated successfully", updated));
    }
}
