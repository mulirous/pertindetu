package com.pertindetu.dev.models.dtos;

import com.pertindetu.dev.models.enums.MediaType;

import jakarta.validation.constraints.NotNull;

public record ServiceMediaRequestDTO(
    @NotNull MediaType type,
    String mediaUrl,
    String shortDescription,
    Long order,
    @NotNull Long serviceId) {
}
