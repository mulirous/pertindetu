package com.pertindetu.dev.models.dtos;

import java.time.Instant;

import com.pertindetu.dev.models.User;
public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String cellphoneNumber,
        String type,
        Instant dateCreation,
        boolean active
) {
    public UserResponseDTO(User user) {
        this(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCellphoneNumber(),
            user.getType().getValue(),
            user.getDateCreation(),
            user.isActive()
        );
    }
}
