package com.pertindetu.dev.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pertindetu.dev.models.Category;
import com.pertindetu.dev.models.dtos.CategoryRequestDTO;
import com.pertindetu.dev.models.dtos.CategoryResponseDTO;
import com.pertindetu.dev.services.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/categories")
@Tag(name = "Admin - Categories", description = "Endpoints para administração de categorias")
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    @Operation(summary = "Listar todas as categorias", description = "Retorna lista paginada de todas as categorias")
    @GetMapping
    public ResponseEntity<Page<CategoryResponseDTO>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<Category> categories = categoryService.findAll(pageable);
        Page<CategoryResponseDTO> dtoPage = categories.map(CategoryResponseDTO::new);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Buscar categoria por ID", description = "Retorna detalhes de uma categoria específica")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return ResponseEntity.ok(new CategoryResponseDTO(category));
    }

    @Operation(summary = "Criar nova categoria", description = "Cria uma nova categoria no sistema")
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CategoryRequestDTO dto) {
        Category newCategory = categoryService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CategoryResponseDTO(newCategory));
    }

    @Operation(summary = "Atualizar categoria", description = "Atualiza os dados de uma categoria existente")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO dto) {
        Category updatedCategory = categoryService.update(id, dto);
        return ResponseEntity.ok(new CategoryResponseDTO(updatedCategory));
    }

    @Operation(summary = "Excluir categoria", description = "Remove permanentemente uma categoria do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Total de categorias", description = "Retorna o total de categorias cadastradas")
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalCategories() {
        long total = categoryService.count();
        return ResponseEntity.ok(total);
    }
}
