package com.pertindetu.dev.models.dtos;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record ProviderProfileRequestDTO(
    String bio,
    boolean verified,
    String pixKey,
    String profilePhotoUrl,

    @NotNull(message = "User ID is required") Long userId,

    List<Long> categoryIds) {
}