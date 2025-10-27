package com.pertindetu.dev.models.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryRequestDTO(
    @NotBlank String name,
    String description,
    @NotNull Long userId) {
}
