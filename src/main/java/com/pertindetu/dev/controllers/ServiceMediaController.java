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

import com.pertindetu.dev.models.ServiceMedia;
import com.pertindetu.dev.models.dtos.ServiceMediaRequestDTO;
import com.pertindetu.dev.models.dtos.ServiceMediaResponseDTO;
import com.pertindetu.dev.services.ServiceMediaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/service-media")
@Tag(name = "Service Media", description = "Endpoints for managing service images and media files")
public class ServiceMediaController {

  @Autowired
  private ServiceMediaService serviceMediaService;

  @Operation(summary = "List all service media")
  @ApiResponse(responseCode = "200", description = "List of service media successfully retrieved")
  @GetMapping
  public ResponseEntity<List<ServiceMediaResponseDTO>> findAll() {
    List<ServiceMediaResponseDTO> list = serviceMediaService.findAll().stream()
        .map(ServiceMediaResponseDTO::new).toList();
    return ResponseEntity.ok(list);
  }

  @Operation(summary = "Get service media by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Service media found"),
      @ApiResponse(responseCode = "404", description = "Service media not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<ServiceMediaResponseDTO> findById(@PathVariable Long id) {
    ServiceMedia media = serviceMediaService.findById(id);
    return ResponseEntity.ok(new ServiceMediaResponseDTO(media));
  }

  @Operation(summary = "Create a new service media entry")
  @ApiResponse(responseCode = "201", description = "Service media created successfully")
  @PostMapping
  public ResponseEntity<ServiceMediaResponseDTO> create(@RequestBody ServiceMediaRequestDTO dto) {
    ServiceMedia created = serviceMediaService.save(dto);
    return ResponseEntity.ok(new ServiceMediaResponseDTO(created));
  }

  @Operation(summary = "Update existing service media")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Service media updated successfully"),
      @ApiResponse(responseCode = "404", description = "Service media not found")
  })
  @PutMapping("/{id}")
  public ResponseEntity<ServiceMediaResponseDTO> update(@PathVariable Long id,
      @RequestBody ServiceMediaRequestDTO dto) {
    ServiceMedia updated = serviceMediaService.update(id, dto);
    return ResponseEntity.ok(new ServiceMediaResponseDTO(updated));
  }

  @Operation(summary = "Delete service media by ID")
  @ApiResponses({
      @ApiResponse(responseCode = "204", description = "Service media deleted successfully"),
      @ApiResponse(responseCode = "404", description = "Service media not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    serviceMediaService.delete(id);
    return ResponseEntity.noContent().build();
  }
}