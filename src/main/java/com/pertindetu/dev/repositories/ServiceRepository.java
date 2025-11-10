package com.pertindetu.dev.repositories;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pertindetu.dev.models.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    // Buscar serviços por provider
    Page<Service> findByProviderId(Long providerId, Pageable pageable);
    
    // Buscar serviços por categoria
    Page<Service> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Buscar serviços com filtros avançados
    @Query(value = "SELECT * FROM services s WHERE " +
               "(:categoryId IS NULL OR s.category_id = :categoryId) AND " +
               "(:providerId IS NULL OR s.provider_id = :providerId) AND " +
               "(:minPrice IS NULL OR s.base_price >= :minPrice) AND " +
               "(:maxPrice IS NULL OR s.base_price <= :maxPrice) AND " +
               "(:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')) " +
               "OR LOWER(s.description) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))",
       nativeQuery = true)
    Page<Service> findByFilters(
        @Param("categoryId") Long categoryId,
        @Param("providerId") Long providerId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("search") String search,
        Pageable pageable
    );
    
    // Buscar serviços com detalhes completos (JOIN FETCH para evitar N+1)
    @Query("SELECT s FROM Service s " +
           "LEFT JOIN FETCH s.category " +
           "LEFT JOIN FETCH s.provider p " +
           "LEFT JOIN FETCH p.user " +
           "WHERE s.id = :id")
    Service findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT COUNT(s) FROM Service s WHERE s.active = true")
    long countByActiveTrue();
}