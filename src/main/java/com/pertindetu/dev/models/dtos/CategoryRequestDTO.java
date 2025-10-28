package com.pertindetu.dev.models.dtos;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequestDTO(
    @NotBlank String name,
    String description) {
}