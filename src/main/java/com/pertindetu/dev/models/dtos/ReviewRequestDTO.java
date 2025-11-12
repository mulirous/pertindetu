package com.pertindetu.dev.models.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewRequestDTO(
    @NotNull(message = "Rating is required") @Min(value = 1, message = "Rating must be at least 1") @Max(value = 5, message = "Rating must be at most 5") Integer rating,

    String comment,

    @NotNull(message = "Order ID is required") Long orderId,

    @NotNull(message = "User ID is required") Long userId,

    @NotNull(message = "Service ID is required") Long serviceId) {
}
