package com.pertindetu.dev.models.dtos;

import java.sql.Timestamp;

import com.pertindetu.dev.models.Evaluation;

public record EvaluationResponseDTO(
    Long id,
    Long score,
    String comment,
    Timestamp createdAt,
    Long orderId,
    Long clientId,
    Long providerProfileId) {
  public EvaluationResponseDTO(Evaluation evaluation) {
    this(
        evaluation.getId(),
        evaluation.getScore(),
        evaluation.getComment(),
        evaluation.getCreatedAt(),
        evaluation.getOrderId(),
        evaluation.getClientId(),
        evaluation.getProviderProfileId());
  }
}