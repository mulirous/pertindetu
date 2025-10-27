package com.pertindetu.dev.models.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EvaluationRequestDTO(
    @NotNull(message = "Score is required") @Min(value = 1, message = "Score must be at least 1") @Max(value = 5, message = "Score must be at most 5") Long score,

    String comment,

    @NotNull(message = "Order ID is required") Long orderId,

    @NotNull(message = "Client ID is required") Long clientId,

    @NotNull(message = "Provider Profile ID is required") Long providerProfileId) {
}