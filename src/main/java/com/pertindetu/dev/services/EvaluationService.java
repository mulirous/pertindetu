package com.pertindetu.dev.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Evaluation;
import com.pertindetu.dev.models.dtos.EvaluationRequestDTO;
import com.pertindetu.dev.repositories.EvaluationRepository;

import jakarta.transaction.Transactional;

@Service
public class EvaluationService {

  @Autowired
  private EvaluationRepository evaluationRepository;

  public List<Evaluation> findAll() {
    return evaluationRepository.findAll();
  }

  public Evaluation findById(Long id) {
    return evaluationRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Evaluation with ID " + id + " not found"));
  }

  @Transactional
  public Evaluation save(EvaluationRequestDTO dto) {
    Evaluation evaluation = new Evaluation();
    evaluation.setScore(dto.score());
    evaluation.setComment(dto.comment());
    evaluation.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    evaluation.setOrderId(dto.orderId());
    evaluation.setClientId(dto.clientId());
    evaluation.setProviderProfileId(dto.providerProfileId());
    return evaluationRepository.save(evaluation);
  }

  @Transactional
  public Evaluation update(Long id, EvaluationRequestDTO dto) {
    Evaluation existing = findById(id);
    existing.setScore(dto.score());
    existing.setComment(dto.comment());
    existing.setOrderId(dto.orderId());
    existing.setClientId(dto.clientId());
    existing.setProviderProfileId(dto.providerProfileId());
    return evaluationRepository.save(existing);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!evaluationRepository.existsById(id))
      throw new ResourceNotFoundException("Evaluation with ID " + id + " not found");
    evaluationRepository.deleteById(id);
  }
}