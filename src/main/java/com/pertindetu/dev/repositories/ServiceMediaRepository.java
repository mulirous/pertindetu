package com.pertindetu.dev.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.ServiceMedia;

public interface ServiceMediaRepository extends JpaRepository<ServiceMedia, Long> {
  
  List<ServiceMedia> findByServiceIdOrderByOrderAsc(Long serviceId);
  
  void deleteByServiceId(Long serviceId);
  
}
