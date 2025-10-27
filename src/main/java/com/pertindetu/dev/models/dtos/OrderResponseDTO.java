package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.enums.OrderStatus;

public record OrderResponseDTO(
    Long id,
    OrderStatus status,
    String details,
    Long quantity,
    BigDecimal value,
    Date eventDate,
    Timestamp createdAt,
    User client,
    User provider,
    Long serviceId,
    Long paymentId,
    Long evaluationId) {
  public OrderResponseDTO(Order order) {
    this(
        order.getId(),
        order.getStatus(),
        order.getDetails(),
        order.getQuantity(),
        order.getValue(),
        order.getEventDate(),
        order.getCreatedAt(),
        order.getClient(),
        order.getProvider(),
        order.getServiceId(),
        order.getPaymentId(),
        order.getEvaluationId());
  }
}