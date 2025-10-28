package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ServiceRequestDTO(
    @NotBlank String title,
    String description,
    @NotNull BigDecimal basePrice,
    @NotNull boolean active,
    BigDecimal avgDuration,
    @NotNull Long providerId,
    @NotNull Long categoryId) {
}