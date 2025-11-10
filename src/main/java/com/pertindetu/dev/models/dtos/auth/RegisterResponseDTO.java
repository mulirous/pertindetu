package com.pertindetu.dev.models.dtos.auth;

public record RegisterResponseDTO(
    Integer statusCode,
    String message,
    Long userId
) {}