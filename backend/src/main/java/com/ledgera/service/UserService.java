package com.ledgera.service;

import com.ledgera.dto.UserResponse;
import com.ledgera.entity.User;
import com.ledgera.enums.Role;
import com.ledgera.exception.BadRequestException;
import com.ledgera.exception.ResourceNotFoundException;
import com.ledgera.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAssignableUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.VIEWER)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getViewerUsers() {
        return getAssignableUsers();
    }

    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getEmail().equals("admin@ledgera.com")) {
            throw new BadRequestException("Cannot deactivate the default admin account");
        }

        user.setActive(!user.getActive());
        userRepository.save(user);

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName() != null ? user.getName() : "")
                .email(user.getEmail() != null ? user.getEmail() : "")
                .role(user.getRole() != null ? user.getRole().name() : "")
                .active(user.getActive() != null ? user.getActive() : Boolean.FALSE)
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .build();
    }
}
