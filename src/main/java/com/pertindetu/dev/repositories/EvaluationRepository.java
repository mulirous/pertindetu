package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Evaluation;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

}
