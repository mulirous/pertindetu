package com.pertindetu.dev.models.dtos.auth;

public record LoginResponseDTO(
    Integer statusCode,
    String message,
    Long userId
) {
}
    