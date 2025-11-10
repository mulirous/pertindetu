package com.pertindetu.dev.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pertindetu.dev.models.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  // Buscar reviews por serviço
  Page<Review> findByServiceId(Long serviceId, Pageable pageable);

  // Buscar reviews por usuário
  Page<Review> findByUserId(Long userId, Pageable pageable);

  // Buscar reviews dos serviços de um provider
  @Query("SELECT r FROM Review r WHERE r.service.provider.id = :providerId")
  Page<Review> findByProviderId(@Param("providerId") Long providerId, Pageable pageable);

  // Verificar se usuário já avaliou um pedido específico
  boolean existsByOrderIdAndUserId(Long orderId, Long userId);

  // Buscar review por pedido
  Optional<Review> findByOrderId(Long orderId);

  // Buscar reviews com detalhes completos (JOIN FETCH para evitar N+1)
  @Query("SELECT r FROM Review r " +
      "LEFT JOIN FETCH r.user " +
      "LEFT JOIN FETCH r.service s " +
      "LEFT JOIN FETCH s.provider " +
      "WHERE r.id = :id")
  Review findByIdWithDetails(@Param("id") Long id);

  // Calcular média de rating de um serviço
  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.id = :serviceId")
  Double getAverageRatingByServiceId(@Param("serviceId") Long serviceId);

  // Calcular média de rating de todos os serviços de um provider
  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.provider.id = :providerId")
  Double getAverageRatingByProviderId(@Param("providerId") Long providerId);

  // Contar total de reviews de um serviço
  long countByServiceId(Long serviceId);

  // Contar total de reviews de um provider
  @Query("SELECT COUNT(r) FROM Review r WHERE r.service.provider.id = :providerId")
  long countByProviderId(@Param("providerId") Long providerId);
}
