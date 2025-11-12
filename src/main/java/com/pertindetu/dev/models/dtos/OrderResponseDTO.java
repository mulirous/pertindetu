package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.enums.OrderStatus;

public record OrderResponseDTO(
    Long id,
    OrderStatus status,
    String details,
    Long quantity,
    BigDecimal value,
    Date eventDate,
    Timestamp createdAt,
    ClientInfoDTO client,
    ProviderInfoDTO provider,
    ServiceInfoDTO service
) {
  public OrderResponseDTO(Order order) {
    this(
        order.getId(),
        order.getStatus(),
        order.getDetails(),
        order.getQuantity(),
        order.getValue(),
        order.getEventDate(),
        order.getCreatedAt(),
        new ClientInfoDTO(order.getClient().getId(), order.getClient().getName(), order.getClient().getEmail()),
        new ProviderInfoDTO(
            order.getProvider().getId(),
            order.getProvider().getUser().getName(),
            order.getProvider().getBio(),
            order.getProvider().isVerified()
        ),
        new ServiceInfoDTO(
            order.getService().getId(),
            order.getService().getTitle(),
            order.getService().getDescription(),
            order.getService().getBasePrice(),
            order.getService().getCategory().getName()
        )
    );
  }

  public record ClientInfoDTO(Long id, String name, String email) {}
  public record ProviderInfoDTO(Long id, String name, String bio, boolean verified) {}
  public record ServiceInfoDTO(Long id, String title, String description, BigDecimal basePrice, String categoryName) {}
}