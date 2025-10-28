package com.pertindetu.dev.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pertindetu.dev.exceptions.ResourceNotFoundException;
import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.dtos.CategoryRequestDTO;
import com.pertindetu.dev.repositories.CategoryRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  public Category findById(Long id) {
    return categoryRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID " + id));
  }

  @Transactional
  public Category save(CategoryRequestDTO dto) {
    Category category = new Category();
    category.setName(dto.name());
    category.setDescription(dto.description());

    return categoryRepository.save(category);
  }

  @Transactional
  public Category update(Long id, CategoryRequestDTO dto) {
    Category existing = findById(id);
    existing.setName(dto.name());
    existing.setDescription(dto.description());
    return categoryRepository.save(existing);
  }

  @Transactional
  public void delete(Long id) {
    Category category = findById(id);
    categoryRepository.delete(category);
  }
}