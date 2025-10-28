package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
