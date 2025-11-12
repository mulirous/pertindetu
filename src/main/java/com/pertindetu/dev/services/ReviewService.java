package com.pertindetu.dev.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.BadRequestException;
import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Order;
import com.pertindetu.dev.models.Review;
import com.pertindetu.dev.models.User;
import com.pertindetu.dev.models.dtos.ReviewRequestDTO;
import com.pertindetu.dev.models.enums.OrderStatus;
import com.pertindetu.dev.repositories.OrderRepository;
import com.pertindetu.dev.repositories.ReviewRepository;
import com.pertindetu.dev.repositories.ServiceRepository;
import com.pertindetu.dev.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {

  @Autowired
  private ReviewRepository reviewRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ServiceRepository serviceRepository;

  public Page<Review> findAll(Pageable pageable) {
    return reviewRepository.findAll(pageable);
  }

  public Page<Review> findByServiceId(Long serviceId, Pageable pageable) {
    return reviewRepository.findByServiceId(serviceId, pageable);
  }

  public Page<Review> findByUserId(Long userId, Pageable pageable) {
    return reviewRepository.findByUserId(userId, pageable);
  }

  public Page<Review> findByProviderId(Long providerId, Pageable pageable) {
    return reviewRepository.findByProviderId(providerId, pageable);
  }

  public Review findById(Long id) {
    return reviewRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));
  }

  public Double getAverageRatingByServiceId(Long serviceId) {
    Double avg = reviewRepository.getAverageRatingByServiceId(serviceId);
    return avg != null ? avg : 0.0;
  }

  public Double getAverageRatingByProviderId(Long providerId) {
    Double avg = reviewRepository.getAverageRatingByProviderId(providerId);
    return avg != null ? avg : 0.0;
  }

  public long countByServiceId(Long serviceId) {
    return reviewRepository.countByServiceId(serviceId);
  }

  public long countByProviderId(Long providerId) {
    return reviewRepository.countByProviderId(providerId);
  }

  @Transactional
  public Review save(ReviewRequestDTO dto) {
    // Validar que o pedido existe
    Order order = orderRepository.findById(dto.orderId())
        .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + dto.orderId()));

    // Validar que o pedido está COMPLETED
    if (order.getStatus() != OrderStatus.COMPLETED) {
      throw new BadRequestException("You can only review completed orders. Current status: " + order.getStatus());
    }

    // Validar que o usuário é o cliente do pedido
    if (!order.getClient().getId().equals(dto.userId())) {
      throw new BadRequestException("You can only review your own orders");
    }

    // Validar que ainda não existe review para este pedido
    if (reviewRepository.existsByOrderIdAndUserId(dto.orderId(), dto.userId())) {
      throw new BadRequestException("You have already reviewed this order");
    }

    // Buscar entidades
    User user = userRepository.findById(dto.userId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.userId()));

    com.pertindetu.dev.models.Service service = serviceRepository.findById(dto.serviceId())
        .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + dto.serviceId()));

    // Criar review
    Review review = new Review();
    review.setRating(dto.rating());
    review.setComment(dto.comment());
    review.setOrder(order);
    review.setUser(user);
    review.setService(service);

    return reviewRepository.save(review);
  }

  @Transactional
  public Review update(Long id, ReviewRequestDTO dto) {
    Review existing = findById(id);

    // Validar que o usuário está atualizando sua própria review
    if (!existing.getUser().getId().equals(dto.userId())) {
      throw new BadRequestException("You can only update your own reviews");
    }

    existing.setRating(dto.rating());
    existing.setComment(dto.comment());

    return reviewRepository.save(existing);
  }

  @Transactional
  public void delete(Long id, Long userId) {
    Review review = findById(id);

    // Validar que o usuário está deletando sua própria review
    if (!review.getUser().getId().equals(userId)) {
      throw new BadRequestException("You can only delete your own reviews");
    }

    reviewRepository.delete(review);
  }
}
