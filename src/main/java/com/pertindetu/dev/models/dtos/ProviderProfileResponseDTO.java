package com.pertindetu.dev.models.dtos;

import java.util.List;

import com.pertindetu.dev.models.ProviderProfile;

public record ProviderProfileResponseDTO(
    Long id,
    String bio,
    boolean verified,
    String pixKey,
    String profilePhotoUrl,
    Long userId,
    String userName,
    List<CategoryResponseDTO> categories) {

  public ProviderProfileResponseDTO(ProviderProfile profile) {
    this(
        profile.getId(),
        profile.getBio(),
        profile.isVerified(),
        profile.getPixKey(),
        profile.getProfilePhotoUrl(),
        profile.getUser().getId(),
        profile.getUser().getName(),
        profile.getCategories() != null ? profile.getCategories().stream()
            .map(CategoryResponseDTO::new)
            .toList()
            : List.of());
  }
}