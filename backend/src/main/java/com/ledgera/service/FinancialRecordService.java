package com.ledgera.service;

import com.ledgera.dto.FinancialRecordRequest;
import com.ledgera.dto.FinancialRecordResponse;
import com.ledgera.entity.FinancialRecord;
import com.ledgera.entity.User;
import com.ledgera.enums.Role;
import com.ledgera.enums.TransactionType;
import com.ledgera.exception.ForbiddenException;
import com.ledgera.exception.ResourceNotFoundException;
import com.ledgera.repository.FinancialRecordRepository;
import com.ledgera.repository.FinancialRecordSpecification;
import com.ledgera.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class FinancialRecordService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository userRepository;

    public FinancialRecordService(FinancialRecordRepository recordRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    public FinancialRecordResponse createRecord(FinancialRecordRequest request) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ANALYST) {
            throw new ForbiddenException("Only ANALYST users can create records");
        }

        User owner = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        FinancialRecord record = FinancialRecord.builder()
                .amount(request.getAmount())
                .type(TransactionType.valueOf(request.getType()))
                .category(request.getCategory())
                .date(request.getDate())
                .description(request.getDescription())
                .user(owner)
                .build();

        return toResponse(recordRepository.save(record));
    }

    public FinancialRecordResponse updateRecord(Long id, FinancialRecordRequest request) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        User currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.VIEWER) {
            throw new ForbiddenException("VIEWER users cannot update records");
        }

        User owner = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        record.setAmount(request.getAmount());
        record.setType(TransactionType.valueOf(request.getType()));
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setDescription(request.getDescription());
        record.setUser(owner);

        return toResponse(recordRepository.save(record));
    }

    public void deleteRecord(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        User currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.VIEWER) {
            throw new ForbiddenException("VIEWER users cannot delete records");
        }

        recordRepository.delete(record);
    }

    public Page<FinancialRecordResponse> getAllRecords(
            LocalDate startDate, LocalDate endDate,
            String category, TransactionType type,
            int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        User currentUser = getCurrentUser();
        Specification<FinancialRecord> spec = currentUser.getRole() == Role.VIEWER
                ? FinancialRecordSpecification.withFilters(startDate, endDate, category, type, currentUser.getId())
                : FinancialRecordSpecification.withFilters(startDate, endDate, category, type);

        return recordRepository.findAll(spec, pageable).map(this::toResponse);
    }

    public FinancialRecordResponse getRecordById(Long id) {
        FinancialRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        User currentUser = getCurrentUser();
        if (currentUser.getRole() == Role.VIEWER && !record.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("VIEWER users can only access their own records");
        }

        return toResponse(record);
    }

    private FinancialRecordResponse toResponse(FinancialRecord record) {
        return FinancialRecordResponse.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .type(record.getType().name())
                .category(record.getCategory())
                .date(record.getDate())
                .description(record.getDescription())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .userId(record.getUser() != null ? record.getUser().getId() : null)
                .userName(record.getUser() != null ? record.getUser().getName() : null)
                .userEmail(record.getUser() != null ? record.getUser().getEmail() : null)
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ForbiddenException("Unauthenticated request");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
