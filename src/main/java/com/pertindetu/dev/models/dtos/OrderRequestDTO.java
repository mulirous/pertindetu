package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderRequestDTO(
    @NotNull(message = "Service ID is required")
    Long serviceId,

    @NotNull(message = "Client ID is required")
    Long clientId,

    @NotNull(message = "Provider ID is required")
    Long providerId,

    String details,

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    Long quantity,

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    BigDecimal value,

    Date eventDate
) {
}