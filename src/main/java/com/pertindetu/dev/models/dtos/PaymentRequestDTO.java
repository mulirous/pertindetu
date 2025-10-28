package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentRequestDTO(
    @NotBlank(message = "Method is required") String method,

    @NotBlank(message = "Status is required") String status,

    @NotNull(message = "Value is required") BigDecimal value,

    @NotNull(message = "Transaction ID is required") Long transactionId,

    @NotNull(message = "Order ID is required") Long orderId) {
}
