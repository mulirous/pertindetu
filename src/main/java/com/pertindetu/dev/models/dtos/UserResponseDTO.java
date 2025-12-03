package com.pertindetu.dev.models.dtos;

import java.time.Instant;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.enums.UserRole;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String cellphoneNumber,
        UserRole role, // Mudou de isAdmin para Role
        Instant dateCreation,
        boolean active) {

    public UserResponseDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCellphoneNumber(),
                user.getRole(),
                user.getDateCreation(),
                user.isEnabled());
    }
}