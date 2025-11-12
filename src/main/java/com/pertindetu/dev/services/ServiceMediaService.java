package com.pertindetu.dev.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Service;
import com.pertindetu.dev.models.ServiceMedia;
import com.pertindetu.dev.models.dtos.ServiceMediaRequestDTO;
import com.pertindetu.dev.repositories.ServiceMediaRepository;
import com.pertindetu.dev.repositories.ServiceRepository;

import jakarta.transaction.Transactional;

@org.springframework.stereotype.Service
public class ServiceMediaService {

  @Autowired
  private ServiceMediaRepository serviceMediaRepository;

  @Autowired
  private ServiceRepository serviceRepository;

  public List<ServiceMedia> findAll() {
    return serviceMediaRepository.findAll();
  }

  public ServiceMedia findById(Long id) {
    return serviceMediaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
  }

  public List<ServiceMedia> findByServiceId(Long serviceId) {
    return serviceMediaRepository.findByServiceIdOrderByOrderAsc(serviceId);
  }

  @Transactional
  public ServiceMedia save(ServiceMediaRequestDTO dto) {
    Service service = serviceRepository.findById(dto.serviceId())
        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

    ServiceMedia media = new ServiceMedia();
    media.setType(dto.type());
    media.setMediaUrl(dto.mediaUrl());
    media.setShortDescription(dto.shortDescription());
    media.setOrder(dto.order() != null ? dto.order() : getNextOrder(dto.serviceId()));
    media.setService(service);

    return serviceMediaRepository.save(media);
  }

  @Transactional
  public ServiceMedia save(Long serviceId, String mediaUrl, com.pertindetu.dev.models.enums.MediaType type, 
                          String shortDescription, Long order) {
    Service service = serviceRepository.findById(serviceId)
        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    
    ServiceMedia media = new ServiceMedia();
    media.setService(service);
    media.setMediaUrl(mediaUrl);
    media.setType(type);
    media.setShortDescription(shortDescription);
    media.setOrder(order != null ? order : getNextOrder(serviceId));
    
    return serviceMediaRepository.save(media);
  }

  @Transactional
  public ServiceMedia update(Long id, ServiceMediaRequestDTO dto) {
    ServiceMedia existing = findById(id);
    existing.setType(dto.type());
    existing.setMediaUrl(dto.mediaUrl());
    existing.setShortDescription(dto.shortDescription());
    existing.setOrder(dto.order());
    return serviceMediaRepository.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    ServiceMedia media = findById(id);
    serviceMediaRepository.delete(media);
  }

  @Transactional
  public void deleteByServiceId(Long serviceId) {
    serviceMediaRepository.deleteByServiceId(serviceId);
  }

  private Long getNextOrder(Long serviceId) {
    List<ServiceMedia> medias = findByServiceId(serviceId);
    if (medias.isEmpty()) {
      return 1L;
    }
    return medias.stream()
        .mapToLong(ServiceMedia::getOrder)
        .max()
        .orElse(0L) + 1L;
  }
}