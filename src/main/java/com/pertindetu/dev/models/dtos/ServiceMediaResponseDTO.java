package com.pertindetu.dev.models.dtos;

import com.pertindetu.dev.models.ServiceMedia;
import com.pertindetu.dev.models.enums.MediaType;

public record ServiceMediaResponseDTO(
    Long id,
    MediaType type,
    String shortDescription,
    Long order,
    Long serviceId) {
  public ServiceMediaResponseDTO(ServiceMedia media) {
    this(
        media.getId(),
        media.getType(),
        media.getShortDescription(),
        media.getOrder(),
        media.getService().getId());
  }
}