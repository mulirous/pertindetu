package com.pertindetu.dev.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.pertindetu.dev.models.ProviderProfile;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM ProviderProfile p WHERE p.verified = true")
    long countByVerifiedTrue();
}
