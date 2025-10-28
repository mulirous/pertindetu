package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;

import com.pertindetu.dev.models.Service;

public record ServiceResponseDTO(
    Long id,
    String title,
    String description,
    BigDecimal basePrice,
    boolean active,
    BigDecimal avgDuration,
    Long providerId,
    Long categoryId) {
  public ServiceResponseDTO(Service service) {
    this(
        service.getId(),
        service.getTitle(),
        service.getDescription(),
        service.getBasePrice(),
        service.isActive(),
        service.getAvgDuration(),
        service.getProvider().getId(),
        service.getCategory().getId());
  }
}