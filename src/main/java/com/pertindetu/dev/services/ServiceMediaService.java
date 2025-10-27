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

  @Transactional
  public ServiceMedia save(ServiceMediaRequestDTO dto) {
    Service service = serviceRepository.findById(dto.serviceId())
        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

    ServiceMedia media = new ServiceMedia();
    media.setType(dto.type());
    media.setShortDescription(dto.shortDescription());
    media.setOrder(dto.order());
    media.setService(service);

    return serviceMediaRepository.save(media);
  }

  @Transactional
  public ServiceMedia update(Long id, ServiceMediaRequestDTO dto) {
    ServiceMedia existing = findById(id);
    existing.setType(dto.type());
    existing.setShortDescription(dto.shortDescription());
    existing.setOrder(dto.order());
    return serviceMediaRepository.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    ServiceMedia media = findById(id);
    serviceMediaRepository.delete(media);
  }
}