package com.pertindetu.dev.services;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Evaluation;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.dtos.EvaluationRequestDTO;
import com.pertindetu.dev.repositories.EvaluationRepository;
import com.pertindetu.dev.repositories.ProviderProfileRepository;

import jakarta.transaction.Transactional;

@Service
public class EvaluationService {

  @Autowired
  private EvaluationRepository evaluationRepository;

  @Autowired
  private ProviderProfileRepository providerProfileRepository;

  public Page<Evaluation> findAll(Pageable pageable) {
    return evaluationRepository.findAll(pageable);
  }

  public Evaluation findById(Long id) {
    return evaluationRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Evaluation with ID " + id + " not found"));
  }

  @Transactional
  public Evaluation save(EvaluationRequestDTO dto) {
    ProviderProfile provider = providerProfileRepository.findById(dto.providerProfileId())
        .orElseThrow(
            () -> new ResourceNotFoundException("Provider Profile not found with ID " + dto.providerProfileId()));

    Evaluation evaluation = new Evaluation();
    evaluation.setScore(dto.score());
    evaluation.setComment(dto.comment());
    evaluation.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    evaluation.setOrderId(dto.orderId());
    evaluation.setClientId(dto.clientId());
    evaluation.setProvider(provider);

    return evaluationRepository.save(evaluation);
  }

  @Transactional
  public Evaluation update(Long id, EvaluationRequestDTO dto) {
    Evaluation existing = findById(id);

    ProviderProfile provider = providerProfileRepository.findById(dto.providerProfileId())
        .orElseThrow(
            () -> new ResourceNotFoundException("Provider Profile not found with ID " + dto.providerProfileId()));

    existing.setScore(dto.score());
    existing.setComment(dto.comment());
    existing.setOrderId(dto.orderId());
    existing.setClientId(dto.clientId());
    existing.setProvider(provider);

    return evaluationRepository.save(existing);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!evaluationRepository.existsById(id))
      throw new ResourceNotFoundException("Evaluation with ID " + id + " not found");
    evaluationRepository.deleteById(id);
  }
}