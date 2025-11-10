package com.pertindetu.dev.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.ProviderProfile;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);
}
