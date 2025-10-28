package com.pertindetu.dev.models.dtos;

import com.pertindetu.dev.models.Category;

public record CategoryResponseDTO(
    Long id,
    String name,
    String description) {
  public CategoryResponseDTO(Category category) {
    this(
        category.getId(),
        category.getName(),
        category.getDescription());
  }
}