package com.pertindetu.dev.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.ProviderProfileRequestDTO;
import com.pertindetu.dev.repositories.CategoryRepository;
import com.pertindetu.dev.repositories.ProviderProfileRepository;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ProviderProfileService {

  @Autowired
  private ProviderProfileRepository providerProfileRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  public Page<ProviderProfile> findAll(Pageable pageable) {
    return providerProfileRepository.findAll(pageable);
  }

  public ProviderProfile findById(Long id) {
    return providerProfileRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("ProviderProfile not found with ID " + id));
  }

  @Transactional
  public ProviderProfile save(ProviderProfileRequestDTO dto) {
    User user = userRepository.findById(dto.userId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID " + dto.userId()));

    List<Category> categories = List.of();
    if (dto.categoryIds() != null && !dto.categoryIds().isEmpty()) {
      categories = categoryRepository.findAllById(dto.categoryIds());
    }

    ProviderProfile profile = new ProviderProfile();
    profile.setBio(dto.bio());
    profile.setVerified(dto.verified());
    profile.setPixKey(dto.pixKey());
    profile.setProfilePhotoUrl(dto.profilePhotoUrl());
    profile.setUser(user);
    profile.setCategories(categories);

    return providerProfileRepository.save(profile);
  }

  @Transactional
  public ProviderProfile update(Long id, ProviderProfileRequestDTO dto) {
    ProviderProfile existing = findById(id);

    User user = userRepository.findById(dto.userId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID " + dto.userId()));

    List<Category> categories = List.of();
    if (dto.categoryIds() != null && !dto.categoryIds().isEmpty()) {
      categories = categoryRepository.findAllById(dto.categoryIds());
    }

    existing.setBio(dto.bio());
    existing.setVerified(dto.verified());
    existing.setPixKey(dto.pixKey());
    existing.setProfilePhotoUrl(dto.profilePhotoUrl());
    existing.setUser(user);
    existing.setCategories(categories);

    return providerProfileRepository.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    ProviderProfile profile = findById(id);
    providerProfileRepository.delete(profile);
  }
}