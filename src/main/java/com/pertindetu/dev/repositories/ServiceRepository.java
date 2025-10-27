package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}