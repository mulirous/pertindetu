package com.pertindetu.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pertindetu.dev.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}