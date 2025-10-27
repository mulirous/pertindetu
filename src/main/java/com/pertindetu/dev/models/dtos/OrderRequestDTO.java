package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.sql.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderRequestDTO(
    @NotBlank(message = "Status is required") String status,

    String details,

    @NotNull(message = "Quantity is required") Long quantity,

    @NotNull(message = "Value is required") BigDecimal value,

    @NotNull(message = "Event date is required") Date eventDate,

    @NotNull(message = "Client ID is required") Long clientId,

    @NotNull(message = "Provider Profile ID is required") Long providerId,

    @NotNull(message = "Service ID is required") Long serviceId) {
}