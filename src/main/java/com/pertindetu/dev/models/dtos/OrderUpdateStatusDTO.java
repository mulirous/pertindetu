package com.pertindetu.dev.models.dtos;

import com.pertindetu.dev.models.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record OrderUpdateStatusDTO(
    @NotNull(message = "Status is required")
    OrderStatus status
) {
}
