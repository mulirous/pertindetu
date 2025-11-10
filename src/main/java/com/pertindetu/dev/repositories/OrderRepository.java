package com.pertindetu.dev.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

  // Buscar pedidos do cliente (paginado)
  Page<Order> findByClientId(Long clientId, Pageable pageable);

  // Buscar pedidos do provider (paginado)
  Page<Order> findByProviderId(Long providerId, Pageable pageable);

  // Buscar pedidos por status
  Page<Order> findByStatus(OrderStatus status, Pageable pageable);

  // Buscar pedidos do cliente por status
  Page<Order> findByClientIdAndStatus(Long clientId, OrderStatus status, Pageable pageable);

  // Buscar pedidos do provider por status
  Page<Order> findByProviderIdAndStatus(Long providerId, OrderStatus status, Pageable pageable);

  // Buscar pedidos de um serviço específico
  Page<Order> findByServiceId(Long serviceId, Pageable pageable);

  // Query customizada: Buscar pedidos do provider com informações completas
  @Query("SELECT o FROM Order o " +
         "JOIN FETCH o.client " +
         "JOIN FETCH o.service s " +
         "JOIN FETCH s.category " +
         "WHERE o.provider.id = :providerId")
  Page<Order> findByProviderIdWithDetails(@Param("providerId") Long providerId, Pageable pageable);

  // Query customizada: Buscar pedidos do cliente com informações completas
  @Query("SELECT o FROM Order o " +
         "JOIN FETCH o.provider p " +
         "JOIN FETCH o.service s " +
         "JOIN FETCH s.category " +
         "WHERE o.client.id = :clientId")
  Page<Order> findByClientIdWithDetails(@Param("clientId") Long clientId, Pageable pageable);
}
