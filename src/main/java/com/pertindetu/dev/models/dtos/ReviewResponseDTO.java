package com.pertindetu.dev.models.dtos;

import java.sql.Timestamp;

import com.pertindetu.dev.models.Review;

public record ReviewResponseDTO(
    Long id,
    Integer rating,
    String comment,
    Long orderId,
    Timestamp createdAt,
    UserInfoDTO user,
    ServiceInfoDTO service) {

  public ReviewResponseDTO(Review review) {
    this(
        review.getId(),
        review.getRating(),
        review.getComment(),
        review.getOrder().getId(),
        review.getCreatedAt(),
        new UserInfoDTO(
            review.getUser().getId(),
            review.getUser().getName(),
            review.getUser().getEmail()),
        new ServiceInfoDTO(
            review.getService().getId(),
            review.getService().getTitle(),
            review.getService().getCategory().getName()));
  }

  public record UserInfoDTO(Long id, String name, String email) {
  }

  public record ServiceInfoDTO(Long id, String title, String categoryName) {
  }
}
