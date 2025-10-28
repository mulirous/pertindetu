package com.pertindetu.dev.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.models.dtos.ServiceRequestDTO;
import com.pertindetu.dev.repositories.CategoryRepository;
import com.pertindetu.dev.repositories.ProviderProfileRepository;
import com.pertindetu.dev.repositories.ServiceRepository;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Service
public class ServiceService {

  @Autowired
  private ServiceRepository serviceRepository;

  @Autowired
  private ProviderProfileRepository providerProfileRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Service> findAll() {
    return serviceRepository.findAll();
  }

  public Service findById(Long id) {
    return serviceRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
  }

  @Transactional
  public Service save(ServiceRequestDTO dto) {
    ProviderProfile provider = providerProfileRepository.findById(dto.providerId())
        .orElseThrow(() -> new ResourceNotFoundException("Provider Profile not found with ID: " + dto.providerId()));

    Category category = categoryRepository.findById(dto.categoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.categoryId()));

    Service service = new Service();
    service.setTitle(dto.title());
    service.setDescription(dto.description());
    service.setBasePrice(dto.basePrice());
    service.setActive(dto.active());
    service.setAvgDuration(dto.avgDuration());
    service.setProvider(provider);
    service.setCategory(category);

    return serviceRepository.save(service);
  }

  @Transactional
  public Service update(Long id, ServiceRequestDTO dto) {
    Service existing = findById(id);

    ProviderProfile provider = providerProfileRepository.findById(dto.providerId())
        .orElseThrow(() -> new ResourceNotFoundException("Provider Profile not found with ID: " + dto.providerId()));

    Category category = categoryRepository.findById(dto.categoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.categoryId()));

    existing.setTitle(dto.title());
    existing.setDescription(dto.description());
    existing.setBasePrice(dto.basePrice());
    existing.setActive(dto.active());
    existing.setAvgDuration(dto.avgDuration());

    existing.setProvider(provider);
    existing.setCategory(category);

    return serviceRepository.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    Service s = findById(id);
    serviceRepository.delete(s);
  }
}
