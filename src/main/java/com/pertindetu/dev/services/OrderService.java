package com.pertindetu.dev.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.OrderRequestDTO;
import com.pertindetu.dev.models.enums.OrderStatus;
import com.pertindetu.dev.repositories.OrderRepository;
import com.pertindetu.dev.repositories.ProviderProfileRepository;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProviderProfileRepository providerProfileRepository;

  public List<Order> findAll() {
    return orderRepository.findAll();
  }

  public Order findById(Long id) {
    return orderRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + id + " not found"));
  }

  @Transactional
  public Order save(OrderRequestDTO dto) {
    Order order = new Order();

    User client = userRepository.findById(dto.clientId())
        .orElseThrow(() -> new ResourceNotFoundException("Client (User) not found with ID " + dto.clientId()));

    ProviderProfile provider = providerProfileRepository.findById(dto.providerId())
        .orElseThrow(() -> new ResourceNotFoundException("Provider Profile not found with ID " + dto.providerId()));

    order.setStatus(OrderStatus.valueOf(dto.status().toUpperCase()));
    order.setDetails(dto.details());
    order.setQuantity(dto.quantity());
    order.setValue(dto.value());
    order.setEventDate(dto.eventDate());
    order.setCreatedAt(new Timestamp(System.currentTimeMillis()));

    order.setClient(userRepository.findById(dto.clientId())
        .orElseThrow(() -> new ResourceNotFoundException("Client not found")));

    order.setClient(client);
    order.setProvider(provider);

    order.setServiceId(dto.serviceId());
    return orderRepository.save(order);
  }

  @Transactional
  public Order update(Long id, OrderRequestDTO dto) {
    Order existing = findById(id);

    User client = userRepository.findById(dto.clientId())
        .orElseThrow(() -> new ResourceNotFoundException("Client (User) not found with ID " + dto.clientId()));

    ProviderProfile provider = providerProfileRepository.findById(dto.providerId())
        .orElseThrow(() -> new ResourceNotFoundException("Provider Profile not found with ID " + dto.providerId()));

    existing.setStatus(OrderStatus.valueOf(dto.status().toUpperCase()));
    existing.setDetails(dto.details());
    existing.setQuantity(dto.quantity());
    existing.setValue(dto.value());
    existing.setEventDate(dto.eventDate());
    existing.setClient(userRepository.findById(dto.clientId())
        .orElseThrow(() -> new ResourceNotFoundException("Client not found")));
    existing.setClient(client);
    existing.setProvider(provider);

    existing.setServiceId(dto.serviceId());

    return orderRepository.save(existing);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!orderRepository.existsById(id))
      throw new ResourceNotFoundException("Order with ID " + id + " not found");
    orderRepository.deleteById(id);
  }
}