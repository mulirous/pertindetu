package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
