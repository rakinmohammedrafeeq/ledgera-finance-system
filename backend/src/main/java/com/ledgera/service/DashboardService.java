package com.ledgera.service;

import com.ledgera.dto.*;
import com.ledgera.entity.FinancialRecord;
import com.ledgera.entity.User;
import com.ledgera.enums.Role;
import com.ledgera.enums.TransactionType;
import com.ledgera.exception.ForbiddenException;
import com.ledgera.repository.FinancialRecordRepository;
import com.ledgera.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final FinancialRecordRepository recordRepository;
    private final UserRepository userRepository;

    public DashboardService(FinancialRecordRepository recordRepository, UserRepository userRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboardData() {
        User currentUser = getCurrentUser();
        boolean restrictToUser = currentUser.getRole() == Role.VIEWER;

        BigDecimal totalIncome = restrictToUser
                ? recordRepository.sumByTypeAndUser(TransactionType.INCOME, currentUser.getId())
                : recordRepository.sumByType(TransactionType.INCOME);
        BigDecimal totalExpenses = restrictToUser
                ? recordRepository.sumByTypeAndUser(TransactionType.EXPENSE, currentUser.getId())
                : recordRepository.sumByType(TransactionType.EXPENSE);
        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<CategoryTotal> categoryTotals = buildCategoryTotals(restrictToUser ? currentUser.getId() : null);
        List<MonthlyTrend> monthlyTrends = buildMonthlyTrends(restrictToUser ? currentUser.getId() : null);
        List<FinancialRecordResponse> recentTransactions = buildRecentTransactions(restrictToUser ? currentUser.getId() : null);

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(netBalance)
                .categoryTotals(categoryTotals)
                .monthlyTrends(monthlyTrends)
                .recentTransactions(recentTransactions)
                .build();
    }

    private List<CategoryTotal> buildCategoryTotals(Long userId) {
        List<Object[]> results = userId == null
                ? recordRepository.getCategoryTotalsByType()
                : recordRepository.getCategoryTotalsByTypeAndUser(userId);
        Map<String, CategoryTotal> categoryMap = new LinkedHashMap<>();

        for (Object[] row : results) {
            String category = (String) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            CategoryTotal ct = categoryMap.computeIfAbsent(category,
                    k -> CategoryTotal.builder()
                            .category(k)
                            .total(BigDecimal.ZERO)
                            .income(BigDecimal.ZERO)
                            .expense(BigDecimal.ZERO)
                            .build());

            if (type == TransactionType.INCOME) {
                ct.setIncome(amount);
            } else {
                ct.setExpense(amount);
            }
            ct.setTotal(ct.getIncome().subtract(ct.getExpense()));
        }

        return new ArrayList<>(categoryMap.values());
    }

    private List<MonthlyTrend> buildMonthlyTrends(Long userId) {
        List<Object[]> results = userId == null
                ? recordRepository.getMonthlyTrends()
                : recordRepository.getMonthlyTrendsByUser(userId);
        Map<String, MonthlyTrend> trendMap = new LinkedHashMap<>();

        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            String key = year + "-" + month;
            MonthlyTrend trend = trendMap.computeIfAbsent(key,
                    k -> MonthlyTrend.builder()
                            .year(year)
                            .month(month)
                            .monthName(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                            .income(BigDecimal.ZERO)
                            .expense(BigDecimal.ZERO)
                            .build());

            if (type == TransactionType.INCOME) {
                trend.setIncome(amount);
            } else {
                trend.setExpense(amount);
            }
        }

        return new ArrayList<>(trendMap.values());
    }

    private List<FinancialRecordResponse> buildRecentTransactions(Long userId) {
        List<FinancialRecord> records = userId == null
                ? recordRepository.findTop10ByOrderByDateDescIdDesc()
                : recordRepository.findTop10ByUserIdOrderByDateDescIdDesc(userId);
        return records.stream().map(record -> FinancialRecordResponse.builder()
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
                .build()).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ForbiddenException("Unauthenticated request");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ForbiddenException("User not found"));
    }
}
