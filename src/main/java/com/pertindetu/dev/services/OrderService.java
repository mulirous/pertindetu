package com.pertindetu.dev.services;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.ProviderProfile;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.OrderRequestDTO;
import com.pertindetu.dev.models.dtos.OrderUpdateStatusDTO;
import com.pertindetu.dev.models.enums.OrderStatus;
import com.pertindetu.dev.repositories.OrderRepository;
import com.pertindetu.dev.repositories.ProviderProfileRepository;
import com.pertindetu.dev.repositories.ServiceRepository;
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

  @Autowired
  private ServiceRepository serviceRepository;

  public Page<Order> findAll(Pageable pageable) {
    return orderRepository.findAll(pageable);
  }

  public Order findById(Long id) {
    return orderRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + id + " not found"));
  }

  // Buscar pedidos do cliente
  public Page<Order> findByClientId(Long clientId, Pageable pageable) {
    return orderRepository.findByClientIdWithDetails(clientId, pageable);
  }

  // Buscar pedidos do provider
  public Page<Order> findByProviderId(Long providerId, Pageable pageable) {
    return orderRepository.findByProviderIdWithDetails(providerId, pageable);
  }

  // Buscar pedidos por status
  public Page<Order> findByStatus(OrderStatus status, Pageable pageable) {
    return orderRepository.findByStatus(status, pageable);
  }

  @Transactional
  public Order save(OrderRequestDTO dto) {
    // Validar entidades relacionadas
    User client = userRepository.findById(dto.clientId())
        .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID " + dto.clientId()));

    ProviderProfile provider = providerProfileRepository.findById(dto.providerId())
        .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID " + dto.providerId()));

    com.pertindetu.dev.models.Service service = serviceRepository.findById(dto.serviceId())
        .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID " + dto.serviceId()));

    // Validar que o serviço pertence ao provider
    if (!service.getProvider().getId().equals(dto.providerId())) {
      throw new IllegalArgumentException("Service does not belong to the specified provider");
    }

    // Criar pedido
    Order order = new Order();
    order.setStatus(OrderStatus.PENDING); // Status inicial sempre PENDING
    order.setDetails(dto.details());
    order.setQuantity(dto.quantity());
    order.setValue(dto.value());
    order.setEventDate(dto.eventDate());
    order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    order.setClient(client);
    order.setProvider(provider);
    order.setService(service);

    return orderRepository.save(order);
  }

  @Transactional
  public Order updateStatus(Long id, OrderUpdateStatusDTO dto, Long providerId) {
    Order order = findById(id);

    // Validar que apenas o provider do pedido pode atualizar o status
    if (!order.getProvider().getId().equals(providerId)) {
      throw new IllegalArgumentException("Only the service provider can update order status");
    }

    // Validar transições de status
    validateStatusTransition(order.getStatus(), dto.status());

    order.setStatus(dto.status());
    return orderRepository.save(order);
  }

  @Transactional
  public Order cancelOrder(Long id, Long clientId) {
    Order order = findById(id);

    // Validar que apenas o cliente pode cancelar
    if (!order.getClient().getId().equals(clientId)) {
      throw new IllegalArgumentException("Only the client can cancel the order");
    }

    // Validar que só pode cancelar se estiver PENDING ou ACCEPTED
    if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.ACCEPTED) {
      throw new IllegalArgumentException("Cannot cancel order with status: " + order.getStatus());
    }

    order.setStatus(OrderStatus.CANCELLED);
    return orderRepository.save(order);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!orderRepository.existsById(id)) {
      throw new ResourceNotFoundException("Order with ID " + id + " not found");
    }
    orderRepository.deleteById(id);
  }

  // Validar transições de status válidas
  private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
    switch (currentStatus) {
      case PENDING:
        if (newStatus != OrderStatus.ACCEPTED && newStatus != OrderStatus.REJECTED) {
          throw new IllegalArgumentException(
              "PENDING can only transition to ACCEPTED or REJECTED");
        }
        break;
      case ACCEPTED:
        if (newStatus != OrderStatus.IN_PROGRESS && newStatus != OrderStatus.CANCELLED) {
          throw new IllegalArgumentException(
              "ACCEPTED can only transition to IN_PROGRESS or CANCELLED");
        }
        break;
      case IN_PROGRESS:
        if (newStatus != OrderStatus.COMPLETED && newStatus != OrderStatus.CANCELLED) {
          throw new IllegalArgumentException(
              "IN_PROGRESS can only transition to COMPLETED or CANCELLED");
        }
        break;
      case REJECTED:
      case COMPLETED:
      case CANCELLED:
        throw new IllegalArgumentException(
            "Cannot change status from " + currentStatus + " (final state)");
      default:
        throw new IllegalArgumentException("Unknown status: " + currentStatus);
    }
  }

  // Admin methods
  public long countAllOrders() {
    return orderRepository.count();
  }

  public long countOrdersByStatus(String status) {
    try {
      OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
      return orderRepository.findAll().stream()
          .filter(order -> order.getStatus() == orderStatus)
          .count();
    } catch (IllegalArgumentException e) {
      return 0;
    }
  }
}
