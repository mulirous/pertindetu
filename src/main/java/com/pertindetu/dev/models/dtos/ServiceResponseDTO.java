package com.pertindetu.dev.models.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.models.ServiceMedia;
import com.pertindetu.dev.models.enums.MediaType;

/**
 * DTO para retorno de serviços ao frontend, alinhado com ServiceData esperado.
 * Inclui provider (id, bio, verified), category (id, name, description) e media list.
 */
public record ServiceResponseDTO(
    Long id,
    String title,
    String description,
    BigDecimal basePrice,
    boolean active,
    BigDecimal avgDuration,
    ProviderDTO provider,
    CategoryDTO category,
    List<ServiceMediaDTO> media
) {
  public ServiceResponseDTO(Service service) {
    this(
        service.getId(),
        service.getTitle(),
        service.getDescription(),
        service.getBasePrice(),
        service.isActive(),
        service.getAvgDuration(),
        toProviderDTO(service.getProvider()),
        toCategoryDTO(service.getCategory()),
        toMediaDTOs(service.getMedia())
    );
  }

  private static ProviderDTO toProviderDTO(ProviderProfile p) {
    if (p == null) return null;
    return new ProviderDTO(p.getId(), p.getBio(), p.isVerified());
  }

  private static CategoryDTO toCategoryDTO(Category c) {
    if (c == null) return null;
    return new CategoryDTO(c.getId(), c.getName(), c.getDescription());
  }

  private static List<ServiceMediaDTO> toMediaDTOs(List<ServiceMedia> list) {
    if (list == null) return List.of();
    return list.stream().map(m -> new ServiceMediaDTO(
        m.getId(),
        m.getType(),
        m.getMediaUrl(),
        m.getShortDescription(),
        m.getOrder()
    )).collect(Collectors.toList());
  }

  public record ProviderDTO(Long id, String bio, boolean verified) {}
  public record CategoryDTO(Long id, String name, String description) {}
  public record ServiceMediaDTO(Long id, MediaType type, String mediaUrl, String shortDescription, Long order) {}
}