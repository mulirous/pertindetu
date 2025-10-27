package com.pertindetu.dev.models.dtos;

import java.time.Instant;

import com.pertindetu.dev.models.User;

public record UserResponseDTO(
    Long id,
    String name,
    String email,
    String cellphoneNumber,
    Instant dateCreation,
    boolean active,
    String bio,
    boolean verified,
    String pixKey,
    String profilePhotoUrl) {
  public UserResponseDTO(User user) {
    this(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getCellphoneNumber(),
        user.getDateCreation(),
        user.isActive(),
        user.getBio(),
        user.isVerified(),
        user.getPixKey(),
        user.getProfilePhotoUrl());
  }
}
