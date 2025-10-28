package com.pertindetu.dev.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.dtos.ApiResponseDTO;
import com.pertindetu.dev.models.dtos.CategoryRequestDTO;
import com.pertindetu.dev.models.dtos.CategoryResponseDTO;
import com.pertindetu.dev.services.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Categories", description = "Endpoints for managing service categories")
@RequestMapping("/categories")
public class CategoryController {

  @Autowired
  private CategoryService categoryService;

  @Operation(summary = "List all categories")
  @ApiResponse(responseCode = "200", description = "List of categories successfully retrieved", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponseDTO.class)))
  @GetMapping
  public ResponseEntity<List<CategoryResponseDTO>> findAll() {
    List<CategoryResponseDTO> list = categoryService.findAll().stream()
        .map(CategoryResponseDTO::new).toList();
    return ResponseEntity.ok(list);
  }

  @Operation(summary = "Get a category by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Category found"),
      @ApiResponse(responseCode = "404", description = "Category not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponseDTO> findById(@PathVariable Long id) {
    Category category = categoryService.findById(id);
    return ResponseEntity.ok(new CategoryResponseDTO(category));
  }

  @Operation(summary = "Create a new category")
  @ApiResponses({
      @ApiResponse(responseCode = "201", description = "Category created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid category data")
  })
  @PostMapping
  public ResponseEntity<CategoryResponseDTO> create(@RequestBody CategoryRequestDTO dto) {
    Category created = categoryService.save(dto);
    return ResponseEntity.ok(new CategoryResponseDTO(created));
  }

  @Operation(summary = "Update an existing category")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Category updated successfully"),
      @ApiResponse(responseCode = "404", description = "Category not found"),
      @ApiResponse(responseCode = "400", description = "Invalid category data")
  })
  @PutMapping("/{id}")
  public ResponseEntity<CategoryResponseDTO> update(@PathVariable Long id, @RequestBody CategoryRequestDTO dto) {
    Category updated = categoryService.update(id, dto);
    return ResponseEntity.ok(new CategoryResponseDTO(updated));
  }

  @Operation(summary = "Delete a category by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Category deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Category not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    categoryService.delete(id);
    return ResponseEntity.noContent().build();
  }
}