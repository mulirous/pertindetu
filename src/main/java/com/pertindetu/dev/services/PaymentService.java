package com.pertindetu.dev.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Payment;
import com.pertindetu.dev.models.dtos.PaymentRequestDTO;
import com.pertindetu.dev.models.enums.PaymentMethod;
import com.pertindetu.dev.models.enums.PaymentStatus;
import com.pertindetu.dev.repositories.PaymentRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepository paymentRepository;

  public List<Payment> findAll() {
    return paymentRepository.findAll();
  }

  public Payment findById(Long id) {
    return paymentRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Payment with ID " + id + " not found"));
  }

  @Transactional
  public Payment save(PaymentRequestDTO dto) {
    Payment payment = new Payment();
    payment.setMethod(PaymentMethod.valueOf(dto.method().toUpperCase()));
    payment.setStatus(PaymentStatus.valueOf(dto.status().toUpperCase()));
    payment.setValue(dto.value());
    payment.setTransactionId(dto.transactionId());
    payment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    payment.setOrderId(dto.orderId());
    return paymentRepository.save(payment);
  }

  @Transactional
  public Payment update(Long id, PaymentRequestDTO dto) {
    Payment existing = findById(id);
    existing.setMethod(PaymentMethod.valueOf(dto.method().toUpperCase()));
    existing.setStatus(PaymentStatus.valueOf(dto.status().toUpperCase()));
    existing.setValue(dto.value());
    existing.setTransactionId(dto.transactionId());
    existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    existing.setOrderId(dto.orderId());
    return paymentRepository.save(existing);
  }

  @Transactional
  public void deleteById(Long id) {
    if (!paymentRepository.existsById(id))
      throw new ResourceNotFoundException("Payment with ID " + id + " not found");
    paymentRepository.deleteById(id);
  }
}