package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.sql.Timestamp;

import com.pertindetu.dev.models.Payment;
import com.pertindetu.dev.models.enums.PaymentMethod;
import com.pertindetu.dev.models.enums.PaymentStatus;

public record PaymentResponseDTO(
    Long id,
    PaymentMethod method,
    PaymentStatus status,
    BigDecimal value,
    Long transactionId,
    Timestamp createdAt,
    Timestamp updatedAt,
    Long orderId) {
  public PaymentResponseDTO(Payment payment) {
    this(
        payment.getId(),
        payment.getMethod(),
        payment.getStatus(),
        payment.getValue(),
        payment.getTransactionId(),
        payment.getCreatedAt(),
        payment.getUpdatedAt(),
        payment.getOrderId());
  }
}